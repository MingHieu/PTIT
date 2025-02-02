import { File, Student } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class StudentEntity {
  @Exclude()
  imageId: number;
  image?: string;

  constructor(student: Student & { image?: File }) {
    Object.assign(this, student);
    this.image = student.image?.url || null;
  }
}
