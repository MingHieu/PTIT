import { Module } from '@nestjs/common';
import { SubmissionModule } from 'src/model/submission/submission.module';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';

@Module({
  imports: [SubmissionModule],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
