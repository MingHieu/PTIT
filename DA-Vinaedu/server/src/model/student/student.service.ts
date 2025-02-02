import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { FileService } from 'src/file/file.service';
import { CreateStudentDto, UpdateStudentDto } from './dto';
import { StudentEntity } from './entity';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private config: ConfigService,
  ) {}

  async create(
    { userId, classroomId }: CreateStudentDto,
    transaction: Partial<PrismaService>,
  ) {
    const user = await transaction.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const student = await transaction.student.create({
      data: { name: user.name, userId, classroomId },
    });
    return student;
  }

  async findAllByClassroomId(classroomId: string, userId: number) {
    await this.prisma.classroom.findUniqueOrThrow({
      where: { id: classroomId, ownerId: userId },
    });
    const students = await this.prisma.student.findMany({
      where: { classroomId },
      include: { user: { select: { email: true } } },
    });
    const exams = await this.prisma.exam.findMany({
      where: { classroomId },
      include: { submissions: true },
    });
    const assignments = await this.prisma.assignment.findMany({
      where: { classroomId },
      include: { submissions: true },
    });
    return students.map((student) => {
      const totalAssignments = assignments.length;
      const completedAssignments = assignments.filter((a) =>
        a.submissions.some((s) => s.studentId == student.id),
      ).length;
      const grades = exams.map((e) => ({
        name: e.title,
        value: e.submissions.find((s) => s.studentId === student.id)?.grade,
      }));
      return {
        id: student.id,
        name: student.name,
        email: student.user.email,
        assignmentProgress: totalAssignments
          ? completedAssignments / totalAssignments
          : 0,
        grades,
        userId: student.userId,
      };
    });
  }

  async getMyStudentInfo(classroomId: string, userId: number) {
    const student = await this.prisma.student.findFirstOrThrow({
      where: { classroomId, userId },
      include: { image: true },
    });
    return new StudentEntity(student);
  }

  async update(id: number, { name }: UpdateStudentDto, userId: number) {
    const student = await this.prisma.student.update({
      where: { id, userId },
      data: { name },
      include: { image: true },
    });
    return new StudentEntity(student);
  }

  remove(classroomId: string, userId: number) {
    return this.prisma.student.delete({
      where: { classroomId_userId: { userId, classroomId } },
    });
  }

  async updateImage(id: number, file: Express.Multer.File, userId: number) {
    let student = await this.prisma.student.findUniqueOrThrow({
      where: { id, userId },
      include: { image: true },
    });

    const faceRecognitionServiceUrl = this.config.get(
      'FACE_RECOGNITION_SERVICE',
    );

    const form = new FormData();
    form.append('file', new Blob([file.buffer]), 'uploaded-image.jpg');

    let haveFace = false;
    try {
      const response = await fetch(`${faceRecognitionServiceUrl}/detect-face`, {
        method: 'POST',
        body: form,
      });
      if (!response.ok) {
        throw await response.json();
      }
      const data = await response.json();
      haveFace = data.success;
    } catch (error) {
      console.error('Không phát hiện được khuôn mặt trong ảnh', error);
      throw new ForbiddenException(
        'Không phát hiện được khuôn mặt trong ảnh. Hãy thử ảnh khác',
      );
    }
    if (!haveFace) {
      throw new ForbiddenException(
        'Không phát hiện được khuôn mặt trong ảnh. Hãy thử ảnh khác',
      );
    }

    if (student.image) {
      this.fileService.delete([student.image.id]);
    }
    if (!file) {
      return { image: null };
    }
    const files = await this.fileService.upload([file]);
    try {
      student = await this.prisma.student.update({
        where: { id },
        data: { image: { connect: { id: files[0].id } } },
        include: { image: true },
      });
      return { image: student.image.url };
    } catch (error) {
      this.fileService.delete(files.map((f) => f.id));
      throw error;
    }
  }
}
