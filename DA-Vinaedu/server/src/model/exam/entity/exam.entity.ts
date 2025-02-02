import { Exam } from '@prisma/client';

export class ExamEntity {
  dueDate: number;

  constructor(exam: Partial<Exam>) {
    Object.assign(this, exam);
    this.dueDate = Number(this.dueDate);
  }
}
