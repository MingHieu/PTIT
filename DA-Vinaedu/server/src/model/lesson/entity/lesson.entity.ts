import { Attendance, Lesson } from '@prisma/client';
import { AttendanceEntity } from 'src/model/attendance/entity';

export class LessonEntity {
  start: number;
  end: number;

  attendances: AttendanceEntity[];

  constructor(lesson: Partial<Lesson> & { attendances?: Attendance[] }) {
    Object.assign(this, lesson);
    this.start = Number(this.start);
    this.end = Number(this.end);
    if (lesson.attendances) {
      this.attendances = lesson.attendances.map((a) => new AttendanceEntity(a));
    }
  }
}
