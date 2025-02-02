import { OmitType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';

export class UpdateLessonDto extends OmitType(CreateLessonDto, [
  'classroomId',
] as const) {}
