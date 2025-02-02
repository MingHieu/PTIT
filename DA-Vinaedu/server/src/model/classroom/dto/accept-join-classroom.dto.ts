import { IsBoolean, IsNumber } from 'class-validator';

export class AcceptJoinClassroomDto {
  @IsNumber()
  requestId: number;

  @IsBoolean()
  isAccept: boolean;
}
