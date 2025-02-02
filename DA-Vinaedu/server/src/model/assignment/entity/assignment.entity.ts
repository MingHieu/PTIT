import { Assignment } from '@prisma/client';

export class AssignmentEntity {
  dueDate: number;

  constructor(assignment: Partial<Assignment>) {
    Object.assign(this, assignment);
    this.dueDate = Number(this.dueDate);
  }
}
