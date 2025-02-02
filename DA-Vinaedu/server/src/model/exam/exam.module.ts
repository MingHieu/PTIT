import { Module } from '@nestjs/common';
import { QuestionModule } from '../question/question.module';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';

@Module({
  imports: [QuestionModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
