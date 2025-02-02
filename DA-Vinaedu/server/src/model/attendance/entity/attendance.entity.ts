import { Attendance } from '@prisma/client';

export class AttendanceEntity {
  checkInAt: number;
  checkOutAt: number;
  commentTime: number;

  constructor(attendance: Partial<Attendance>) {
    Object.assign(this, attendance);
    this.checkInAt = Number(this.checkInAt);
    this.checkOutAt = Number(this.checkOutAt);
    this.commentTime = Number(this.commentTime);
  }
}
