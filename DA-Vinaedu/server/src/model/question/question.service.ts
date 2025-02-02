import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateQuestionDto } from './dto';

@Injectable()
export class QuestionService {
  async createMany(
    transaction: Partial<PrismaService>,
    questions: CreateQuestionDto[],
    assignmentId?: number,
    examId?: number,
  ) {
    const questionsSaved = await transaction.question.createManyAndReturn({
      data: questions.map((q) => ({
        title: q.title,
        assignmentId,
        examId,
      })),
    });
    await transaction.answer.createMany({
      data: questions
        .map((q, i) =>
          q.answers.map(({ title, correct }) => ({
            title,
            correct,
            questionId: questionsSaved[i].id,
          })),
        )
        .flat(),
    });
  }

  async remove(transaction: Partial<PrismaService>, ids: number[]) {
    await transaction.question.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
