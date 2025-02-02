import { Classroom, File, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ClassroomEntity {
  @Exclude()
  ownerId: number;
  owner: Partial<User>;

  @Exclude()
  bannerId: number;
  banner?: string;

  @Exclude()
  _count: { students: number };
  students: number;

  constructor(
    classroom: Classroom & { banner?: File; owner: User } & {
      _count?: { students: number };
    },
  ) {
    Object.assign(this, classroom);
    this.banner = classroom.banner?.url || null;
    this.owner = {
      name: classroom.owner.name,
      email: classroom.owner.email,
    };
    if (classroom._count?.students != null) {
      this.students = classroom._count.students;
    }
  }
}
