import { OmitType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends OmitType(CreateStudentDto, [
  'classroomId',
  'userId',
] as const) {}
