import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator';
import {
  EssaySubmissionDto,
  QuizSubmissionDto,
  ScoreSubmissionDto,
} from './dto';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post('quiz')
  handleQuizSubmission(
    @Body() body: QuizSubmissionDto,
    @GetUser('userId') userId: number,
  ) {
    return this.submissionService.handleQuizSubmission(body, userId);
  }

  @Post('essay')
  @UseInterceptors(FileInterceptor('file'))
  handleEssaySubmission(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: EssaySubmissionDto,
    @GetUser('userId') userId: number,
  ) {
    return this.submissionService.handleEssaySubmission(file, body, userId);
  }

  @Post(':id/score')
  scoreSubmission(
    @Param('id') id: number,
    @Body() body: ScoreSubmissionDto,
    @GetUser('userId') userId: number,
  ) {
    return this.submissionService.scoreSubmission(id, body, userId);
  }
}
