import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import * as moment from 'moment';
import { generateUniqueString } from 'src/common/utils';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { SubmissionService } from 'src/model/submission/submission.service';
import { CreateInteractDto, CreateMeetingDto } from './dto';

@Injectable()
export class MeetingService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private submissionService: SubmissionService,
  ) {}

  async createZoomMeeting(
    { classroomId, token }: CreateMeetingDto,
    userId: number,
  ) {
    const classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: {
        id: classroomId,
        OR: [{ ownerId: userId }, { students: { some: { userId } } }],
      },
    });
    if (classroom.meeting) {
      return classroom.meeting;
    }
    try {
      const res = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const meeting = await res.json();
      if (meeting.message) {
        throw meeting;
      }
      await this.prisma.classroom.update({
        where: { id: classroomId },
        data: { meeting },
      });
      return meeting;
    } catch (error) {
      console.log('Tạo phòng học trực tuyến thất bại', error);
      throw new ForbiddenException('Tạo phòng học trực tuyến thất bại');
    }
  }

  async handleMeetingAuth(code: string, res: Response) {
    const auth =
      this.config.get('ZOOM_CLIENT_ID') +
      ':' +
      this.config.get('ZOOM_CLIENT_SECRET');
    const authRes = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(auth).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.get('ZOOM_REDIRECT_URL'),
      }),
    });
    const data = await authRes.json();
    res.redirect(
      `${this.config.get('ZOOM_REDIRECT_CLIENT_URL')}?auth_data=${JSON.stringify(data)}`,
    );
  }

  async createInteract(body: CreateInteractDto, userId: number) {
    const { lessonId, ...interact } = body;
    const lesson = await this.prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId, classroom: { ownerId: userId } },
      include: { classroom: { select: { students: true } } },
    });
    const interactId = generateUniqueString();
    const data = {
      id: interactId,
      createdAt: moment().valueOf(),
      type: interact.type,
      data: {},
    };

    if (interact.type == 'QUIZ') {
      const questions = interact.data.questions.map((q, qI) => ({
        ...q,
        id: qI,
        answers: q.answers.map((a, aI) => ({ ...a, id: aI })),
      }));
      data.data = { questions };
    }

    await this.cacheManager.set(interactId, data, 360 * 60 * 1000);
    const interactIdsKey = `interact-${lessonId}`;
    let interactIds: string[] = await this.cacheManager.get(interactIdsKey);
    if (!interactIds) interactIds = [];
    interactIds.push(interactId);
    await this.cacheManager.set(interactIdsKey, interactIds, 360 * 60 * 1000);
    this.eventEmitter.emit('meeting.interact', {
      students: lesson.classroom.students,
      data,
    });
    return { id: interactId };
  }

  async submitInteract(interactId: string, body: any, userId: number) {
    const interact: any = await this.cacheManager.get(interactId);
    if (!interact) throw new ForbiddenException('Hành động không hợp lệ');

    const submissionKey = `submission-${interactId}`;
    let submissions: { userId: number; data: any }[] =
      await this.cacheManager.get(submissionKey);
    if (!submissions) submissions = [];
    const submission = { userId, createdAt: moment().valueOf(), data: body };

    if (interact.type == 'QUIZ') {
      submission.data.grade = this.submissionService.getGrade(
        interact.data.questions,
        body.answers,
      );
    }

    submissions.push(submission);
    await this.cacheManager.set(submissionKey, submissions, 360 * 60 * 1000);
    return submission;
  }

  async findAllInteractSubmission(
    interactId: string,
    lessonId: number,
    userId: number,
  ) {
    await this.prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId, classroom: { ownerId: userId } },
    });
    const submissionKey = `submission-${interactId}`;
    const submissions = await this.cacheManager.get(submissionKey);
    return submissions ?? [];
  }

  async findAllInteractByLessonId(lessonId: number, userId: number) {
    await this.prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId, classroom: { ownerId: userId } },
    });
    const interactIdsKey = `interact-${lessonId}`;
    let interactIds: string[] = await this.cacheManager.get(interactIdsKey);
    if (!interactIds) interactIds = [];
    const interacts = [];
    for (const id of interactIds) {
      const interact = await this.cacheManager.get(id);
      interacts.push(interact);
    }
    return interacts;
  }
}
