import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { SuccessResponse } from 'src/common/response';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonEntity } from './entity';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async create({ start, end, classroomId }: CreateLessonDto, userId: number) {
    await this.prisma.classroom.findUniqueOrThrow({
      where: { id: classroomId, ownerId: userId },
    });
    const lesson = await this.prisma.lesson.create({
      data: { start, end, classroomId },
    });
    return new LessonEntity(lesson);
  }

  async findAllByClassroomId(classroomId: string, userId: number) {
    const classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: {
        id: classroomId,
        OR: [{ ownerId: userId }, { students: { some: { userId } } }],
      },
    });
    const lessons = await this.prisma.lesson.findMany({
      where: { classroomId },
      include: {
        attendances: classroom.ownerId == userId || {
          where: { student: { userId } },
        },
      },
      omit: { classroomId: true },
      orderBy: { start: 'asc' },
    });
    return lessons.map((lesson) => new LessonEntity(lesson));
  }

  async update(id: number, { start, end }: UpdateLessonDto, userId: number) {
    const lesson = await this.prisma.lesson.update({
      where: { id, classroom: { ownerId: userId } },
      data: { start, end },
    });
    return new LessonEntity(lesson);
  }

  async remove(id: number, userId: number) {
    await this.prisma.lesson.delete({
      where: { id, classroom: { ownerId: userId } },
    });
    return SuccessResponse;
  }

  async getTimetable(timestamp: number, userId: number) {
    const startOfMonth = BigInt(moment(timestamp).startOf('month').valueOf());
    const endOfMonth = BigInt(moment(timestamp).endOf('month').valueOf());

    const lessons = await this.prisma.lesson.findMany({
      where: {
        start: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        classroom: {
          OR: [{ ownerId: userId }, { students: { some: { userId } } }],
        },
      },
      include: { classroom: true },
      orderBy: { start: 'asc' },
    });
    return lessons.map((lesson) => new LessonEntity(lesson));
  }
}
