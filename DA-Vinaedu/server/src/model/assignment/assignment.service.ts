import { Injectable } from '@nestjs/common';
import { AssignmentType } from '@prisma/client';
import { SuccessResponse } from 'src/common/response';
import { SELECT_FILE } from 'src/database/prisma/prisma.helpers';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { FileService } from 'src/file/file.service';
import { NotificationService } from 'src/notification/notification.service';
import { QuestionService } from '../question/question.service';
import {
  CreateAssignmentCategoryDto,
  CreateAssignmentDto,
  UpdateAssignmentCategoryDto,
  UpdateAssignmentDto,
} from './dto';
import { AssignmentEntity } from './entity';

@Injectable()
export class AssignmentService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private questionService: QuestionService,
    private notificationService: NotificationService,
  ) {}

  async create(
    files: Express.Multer.File[],
    body: CreateAssignmentDto,
    userId: number,
  ) {
    const {
      classroomId,
      title,
      description,
      dueDate,
      type,
      questions,
      categoryId,
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
        const assignment = await transaction.assignment.create({
          data: {
            title,
            description,
            dueDate,
            type,
            files: { connect: fileIds.map((fileId) => ({ id: fileId })) },
            classroomId,
            categoryId,
          },
        });
        if (type == AssignmentType.QUIZ && questions?.length) {
          await this.questionService.createMany(
            transaction,
            questions,
            assignment.id,
          );
        }
        this.notificationService.createMany(
          classroom.students.map((s) => ({
            title: `Bài tập ${assignment.title} trong lớp học ${classroom.name} đang chờ bạn`,
            message: `Lớp học của bạn đã có bài tập mới. Hãy vào làm ngay!`,
            data: {
              url: `/classroom/${classroomId}/assignment#${assignment.id}`,
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
    const assignments = await this.prisma.assignment.findMany({
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
        category: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return assignments.map((assignment) => new AssignmentEntity(assignment));
  }

  async update(
    id: number,
    files: Express.Multer.File[],
    body: UpdateAssignmentDto,
    userId: number,
  ) {
    const {
      fileIds,
      title,
      description,
      dueDate,
      type,
      questions,
      isQuestionChanged,
      categoryId,
    } = body;

    const assignment = await this.prisma.assignment.findUniqueOrThrow({
      where: { id, classroom: { ownerId: userId } },
      include: { files: true, questions: true },
    });

    const fileRemoveIds = assignment.files
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
            assignment.questions.map((q) => q.id),
          );
          if (type == AssignmentType.QUIZ && questions?.length) {
            await this.questionService.createMany(
              transaction,
              questions,
              assignment.id,
            );
          }
        }
        await transaction.assignment.update({
          where: { id },
          data: {
            title,
            description,
            dueDate,
            type,
            files: { connect: finalFileIds.map((fileId) => ({ id: fileId })) },
            categoryId,
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
    await this.prisma.assignment.delete({
      where: { id, classroom: { ownerId: userId } },
    });
    return SuccessResponse;
  }

  async findAllCategoryByClassroomId(classroomId: string, userId: number) {
    const classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: {
        id: classroomId,
        OR: [{ ownerId: userId }, { students: { some: { userId } } }],
      },
      include: { assignmentCategories: { orderBy: { createdAt: 'asc' } } },
    });
    return classroom.assignmentCategories;
  }

  async createCategory(
    { classroomId, title }: CreateAssignmentCategoryDto,
    userId: number,
  ) {
    await this.prisma.classroom.findUniqueOrThrow({
      where: { id: classroomId, ownerId: userId },
    });
    return this.prisma.assignmentCategory.create({
      data: { classroomId, title },
    });
  }

  updateCategory(
    id: number,
    { title }: UpdateAssignmentCategoryDto,
    userId: number,
  ) {
    return this.prisma.assignmentCategory.update({
      where: { id, classroom: { ownerId: userId } },
      data: { title },
    });
  }

  removeCategory(id: number, userId: number) {
    return this.prisma.assignmentCategory.delete({
      where: { id, classroom: { ownerId: userId } },
    });
  }
}
