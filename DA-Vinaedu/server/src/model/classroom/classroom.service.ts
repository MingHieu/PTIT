import { Injectable } from '@nestjs/common';
import { ClassroomStatus } from '@prisma/client';
import { SuccessResponse } from 'src/common/response';
import { generateUniqueString } from 'src/common/utils';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { FileService } from 'src/file/file.service';
import { NotificationService } from 'src/notification/notification.service';
import { StudentService } from '../student/student.service';
import {
  AcceptJoinClassroomDto,
  CreateClassroomDto,
  UpdateClassroomDto,
} from './dto';
import { ClassroomEntity } from './entity';

@Injectable()
export class ClassroomService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private studentService: StudentService,
    private notificationService: NotificationService,
  ) {}

  async create(body: CreateClassroomDto, ownerId: number) {
    const { name, description, isPrivate } = body;
    await this.prisma.classroom.create({
      data: {
        id: generateUniqueString(),
        name,
        description,
        ownerId,
        isPrivate,
        status: ClassroomStatus.ACTIVE,
      },
    });
    return SuccessResponse;
  }

  async findAllByUserId(userId: number) {
    const classrooms = await this.prisma.classroom.findMany({
      where: {
        OR: [{ ownerId: userId }, { students: { some: { userId } } }],
      },
      include: {
        owner: true,
        banner: true,
        _count: { select: { students: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return classrooms.map((classroom) => new ClassroomEntity(classroom));
  }

  async findOne(id: string, userId: number) {
    const classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: {
        id,
        OR: [{ ownerId: userId }, { students: { some: { userId } } }],
      },
      include: {
        owner: true,
        banner: true,
        _count: { select: { students: true } },
      },
    });
    return new ClassroomEntity(classroom);
  }

  async update(id: string, body: UpdateClassroomDto, userId: number) {
    const { name, description, isPrivate, status } = body;
    const classroom = await this.prisma.classroom.update({
      where: { id, ownerId: userId },
      data: { name, description, status, isPrivate },
      include: {
        owner: true,
        banner: true,
        _count: { select: { students: true } },
      },
    });
    return new ClassroomEntity(classroom);
  }

  async remove(id: string, userId: number) {
    await this.prisma.classroom.delete({ where: { id, ownerId: userId } });
    return SuccessResponse;
  }

  async join(classroomId: string, userId: number) {
    const student = await this.prisma.student.findFirst({
      where: { userId, classroomId },
    });
    if (student) {
      return SuccessResponse;
    }
    const classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: { id: classroomId },
    });
    if (classroom.ownerId == userId) {
      return SuccessResponse;
    }
    if (classroom.isPrivate) {
      await this.prisma.classroomRequest.create({
        data: { classroomId, userId },
      });
    } else {
      await this.acceptJoin(classroomId, userId);
    }
    return SuccessResponse;
  }

  async acceptJoin(
    classroomId: string,
    userId: number,
    body?: AcceptJoinClassroomDto,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      if (body) {
        const classroom = await transaction.classroom.findUniqueOrThrow({
          where: { id: classroomId, ownerId: userId },
        });
        const request = await transaction.classroomRequest.delete({
          where: { id: body.requestId },
        });
        if (!body.isAccept) {
          return SuccessResponse;
        }
        await this.studentService.create(
          { classroomId, userId: request.userId },
          transaction,
        );
        this.notificationService.create({
          title: `Yêu cầu tham gia ${classroom.name} đã được chấp thuận`,
          message: `Bạn đã được phê duyệt vào lớp học. Hãy nhấn vào đây để truy cập vào lớp của bạn!`,
          data: {
            url: `/classroom/${classroomId}`,
          },
          userId: request.userId,
        });
      } else {
        await this.studentService.create({ classroomId, userId }, transaction);
      }
      return SuccessResponse;
    });
  }

  async getJoinRequests(classroomId: string, userId: number) {
    const requests = await this.prisma.classroomRequest.findMany({
      where: { classroom: { id: classroomId, ownerId: userId } },
      include: { user: { select: { name: true, email: true } } },
    });
    return requests;
  }

  async updateBanner(id: string, file: Express.Multer.File, userId: number) {
    let classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: { id, ownerId: userId },
      include: { banner: true },
    });
    if (classroom.banner) {
      this.fileService.delete([classroom.banner.id]);
    }
    if (!file) {
      return { banner: null };
    }
    const files = await this.fileService.upload([file]);
    try {
      classroom = await this.prisma.classroom.update({
        where: { id },
        data: { banner: { connect: { id: files[0].id } } },
        include: { banner: true },
      });
      return { banner: classroom.banner.url };
    } catch (error) {
      this.fileService.delete(files.map((f) => f.id));
      throw error;
    }
  }
}
