import { Injectable } from '@nestjs/common';
import { AssignmentType } from '@prisma/client';
import { SuccessResponse } from 'src/common/response';
import { SELECT_FILE } from 'src/database/prisma/prisma.helpers';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { FileService } from 'src/file/file.service';
import { NotificationService } from 'src/notification/notification.service';
import { QuestionService } from '../question/question.service';
import { CreateExamDto, UpdateExamDto } from './dto';
import { ExamEntity } from './entity';

@Injectable()
export class ExamService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private questionService: QuestionService,
    private notificationService: NotificationService,
  ) {}

  async create(
    files: Express.Multer.File[],
    body: CreateExamDto,
    userId: number,
  ) {
    const {
      classroomId,
      title,
      description,
      dueDate,
      duration,
      isGraded,
      type,
      questions,
    } = body;

    const classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: { id: classroomId, ownerId: userId },
      include: { students: true },
    });

    let fileIds = [];
    let uploadedFiles = [];
    if (type == AssignmentType.ESSAY && files?.length) {
      uploadedFiles = await this.fileService.upload(files);
      fileIds = uploadedFiles.map((file) => file.id);
    }

    return this.prisma.$transaction(async (transaction) => {
      try {
        const exam = await transaction.exam.create({
          data: {
            title,
            description,
            dueDate,
            duration,
            type,
            isGraded,
            files: { connect: fileIds.map((fileId) => ({ id: fileId })) },
            classroomId,
          },
        });
        if (type == AssignmentType.QUIZ && questions?.length) {
          await this.questionService.createMany(
            transaction,
            questions,
            null,
            exam.id,
          );
        }
        this.notificationService.createMany(
          classroom.students.map((s) => ({
            title: `Bài kiểm tra ${exam.title} trong lớp học ${classroom.name} đang chờ bạn`,
            message: `Lớp học của bạn đã có bài kiểm tra mới. Hãy vào làm ngay!`,
            data: {
              url: `/classroom/${classroomId}/exam#${exam.id}`,
            },
            userId: s.userId,
          })),
        );
        return SuccessResponse;
      } catch (error) {
        this.fileService.delete(uploadedFiles.map((f) => f.id));
        throw error;
      }
    });
  }

  async findAllByClassroomId(classroomId: string, userId: number) {
    const classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: {
        id: classroomId,
        OR: [{ ownerId: userId }, { students: { some: { userId } } }],
      },
    });
    const exams = await this.prisma.exam.findMany({
      where: { classroomId },
      include: {
        files: SELECT_FILE,
        questions: {
          include: {
            answers: {
              omit: { correct: !(classroom.ownerId == userId) },
            },
          },
        },
        submissions: {
          where:
            classroom.ownerId == userId ? undefined : { student: { userId } },
          include: { file: SELECT_FILE },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return exams.map((exam) => new ExamEntity(exam));
  }

  async update(
    id: number,
    files: Express.Multer.File[],
    body: UpdateExamDto,
    userId: number,
  ) {
    const {
      fileIds,
      title,
      description,
      dueDate,
      duration,
      isGraded,
      type,
      questions,
      isQuestionChanged,
    } = body;
    const exam = await this.prisma.exam.findUniqueOrThrow({
      where: { id, classroom: { ownerId: userId } },
      include: { files: true, questions: true },
    });

    const fileRemoveIds = exam.files
      .filter(
        (file) => !fileIds.includes(file.id) || type == AssignmentType.QUIZ,
      )
      .map((file) => file.id);

    if (fileRemoveIds.length) {
      this.fileService.delete(fileRemoveIds);
    }

    let finalFileIds = [...fileIds];
    let uploadedFiles = [];
    if (files?.length) {
      uploadedFiles = await this.fileService.upload(files);
      finalFileIds = [...finalFileIds, ...uploadedFiles.map((file) => file.id)];
    }

    return this.prisma.$transaction(async (transaction) => {
      try {
        if (isQuestionChanged || type == AssignmentType.ESSAY) {
          await this.questionService.remove(
            transaction,
            exam.questions.map((q) => q.id),
          );
          if (type == AssignmentType.QUIZ && questions?.length) {
            await this.questionService.createMany(
              transaction,
              questions,
              null,
              exam.id,
            );
          }
        }
        await transaction.exam.update({
          where: { id },
          data: {
            title,
            description,
            dueDate,
            duration,
            isGraded,
            type,
            files: { connect: finalFileIds.map((fileId) => ({ id: fileId })) },
          },
        });
        return SuccessResponse;
      } catch (error) {
        this.fileService.delete(uploadedFiles.map((f) => f.id));
        throw error;
      }
    });
  }

  async remove(id: number, userId: number) {
    await this.prisma.exam.delete({
      where: { id, classroom: { ownerId: userId } },
    });
    return SuccessResponse;
  }
}
