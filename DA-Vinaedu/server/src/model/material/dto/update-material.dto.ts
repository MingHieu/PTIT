import { OmitType } from '@nestjs/mapped-types';
import { CreateMaterialDto } from './create-material.dto';

export class UpdateMaterialDto extends OmitType(CreateMaterialDto, [
  'classroomId',
] as const) {}
