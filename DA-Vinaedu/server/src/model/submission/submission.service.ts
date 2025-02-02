import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Answer, Question } from '@prisma/client';
import * as moment from 'moment';
import { SuccessResponse } from 'src/common/response';
import { SELECT_FILE } from 'src/database/prisma/prisma.helpers';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { FileService } from 'src/file/file.service';
import { NotificationService } from 'src/notification/notification.service';
import {
  AnswerDto,
  EssaySubmissionDto,
  QuizSubmissionDto,
  ScoreSubmissionDto,
} from './dto';

@Injectable()
export class SubmissionService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private notificationService: NotificationService,
  ) {}

  private async checkExamDueDate(examId: number) {
    const exam = await this.prisma.exam.findUniqueOrThrow({
      where: { id: examId },
      include: { questions: { include: { answers: true } } },
    });
    if (exam.dueDate && moment(Number(exam.dueDate)).isBefore(moment())) {
      throw new ForbiddenException('Đã quá thời hạn nộp bài');
    }
    return exam;
  }

  private async getStudent(classroomId: string, userId: number) {
    const classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: { id: classroomId, students: { some: { userId } } },
      include: { students: true },
    });
    return classroom.students.find((s) => s.userId == userId);
  }

  getGrade(
    questions: (Question & { answers: Answer[] })[],
    studentAnswers: AnswerDto[],
  ) {
    let correctQuestions = 0;
    studentAnswers.forEach((sA) => {
      const question = questions.find((q) => q.id == sA.questionId);
      if (!question) return;

      const correctAnswerIds = question.answers
        .filter((a) => a.correct)
        .map((a) => a.id)
        .sort();

      const studentAnswerIds = sA.answerIds.sort();

      if (
        correctAnswerIds.length === studentAnswerIds.length &&
        correctAnswerIds.every((id, index) => id === studentAnswerIds[index])
      ) {
        correctQuestions += 1;
      }
    });

    return (correctQuestions * 10) / questions.length;
  }

  async handleQuizSubmission(body: QuizSubmissionDto, userId: number) {
    const { classroomId, assignmentId, examId, answers } = body;

    const student = await this.getStudent(classroomId, userId);

    let grade = 0;

    if (examId) {
      const exam = await this.checkExamDueDate(examId);
      grade = this.getGrade(exam.questions, answers);
    }

    if (assignmentId) {
      const assignment = await this.prisma.assignment.findUniqueOrThrow({
        where: { id: assignmentId },
        include: { questions: { include: { answers: true } } },
      });
      grade = this.getGrade(assignment.questions, answers);
    }

    return this.prisma.submission.create({
      data: {
        assignmentId,
        examId,
        studentId: student.id,
        answerIds: answers.map((a) => a.answerIds).flat(),
        grade,
      },
      include: { file: SELECT_FILE },
    });
  }

  async handleEssaySubmission(
    file: Express.Multer.File,
    body: EssaySubmissionDto,
    userId: number,
  ) {
    if (!file) throw new BadRequestException('Tệp tin không có dữ liệu');

    const { classroomId, assignmentId, examId } = body;

    const student = await this.getStudent(classroomId, userId);

    if (examId) {
      await this.checkExamDueDate(examId);
    }

    const uploadedFiles = await this.fileService.upload([file]);

    try {
      const submission = await this.prisma.submission.create({
        data: {
          assignmentId,
          examId,
          studentId: student.id,
          file: { connect: { id: uploadedFiles[0].id } },
        },
        include: { file: SELECT_FILE },
      });
      return submission;
    } catch (error) {
      this.fileService.delete(uploadedFiles.map((f) => f.id));
      throw error;
    }
  }

  async scoreSubmission(id: number, body: ScoreSubmissionDto, userId: number) {
    const { grade, feedback } = body;
    const submission = await this.prisma.submission.update({
      where: {
        id,
        OR: [
          { assignment: { classroom: { ownerId: userId } } },
          { exam: { classroom: { ownerId: userId } } },
        ],
      },
      data: { grade, feedback },
      include: {
        assignment: { include: { classroom: true } },
        exam: { include: { classroom: true } },
        student: true,
      },
    });
    const isExam = !!submission.examId;
    const type = isExam ? 'Bài kiểm tra' : 'Bài tập';
    const name = isExam ? submission.exam.title : submission.assignment.title;
    const classroom = isExam
      ? submission.exam.classroom
      : submission.assignment.classroom;
    const url = isExam ? 'exam' : 'assignment';
    const contentId = submission.examId || submission.assignmentId;
    this.notificationService.create({
      title: `${type} ${name} đã được chấm điểm trong lớp ${classroom.name}`,
      message: `Điểm cho ${type.toLowerCase()} ${name} trong lớp ${classroom.name} đã được cập nhật. Xem chi tiết để biết thêm!`,
      data: {
        url: `/classroom/${classroom.id}/${url}#${contentId}`,
      },
      userId: submission.student.userId,
    });
    return SuccessResponse;
  }
}
