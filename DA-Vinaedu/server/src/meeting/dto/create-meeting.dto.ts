import { IsNotEmpty } from 'class-validator';

export class CreateMeetingDto {
  @IsNotEmpty()
  classroomId: string;

  @IsNotEmpty()
  token: string;
}
