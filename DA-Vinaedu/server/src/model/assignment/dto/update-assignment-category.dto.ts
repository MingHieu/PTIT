import { OmitType } from '@nestjs/mapped-types';
import { CreateAssignmentCategoryDto } from './create-assignment-category.dto';

export class UpdateAssignmentCategoryDto extends OmitType(
  CreateAssignmentCategoryDto,
  ['classroomId'] as const,
) {}
