import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CommentAttendanceDto, CreateAttendanceDto } from './dto';
import { AttendanceEntity } from './entity';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async checkInOut({ lessonId, image }: CreateAttendanceDto, userId: number) {
    const student = await this.prisma.student.findFirstOrThrow({
      where: {
        userId,
        classroom: { lessons: { some: { id: lessonId } } },
      },
      include: { image: true },
    });
    let attendance = await this.prisma.attendance.findFirst({
      where: { studentId: student.id, lessonId },
    });

    if (attendance?.checkInAt) {
      attendance = await this.prisma.attendance.update({
        where: { studentId_lessonId: { studentId: student.id, lessonId } },
        data: { checkOutAt: Date.now() },
      });
      return new AttendanceEntity(attendance);
    }

    const { match } = await this.compareFace(student.image, image);
    if (!match) {
      throw new ForbiddenException(
        'Khuôn mặt không khớp với hình ảnh đã cài đặt',
      );
    }

    attendance = await this.prisma.attendance.upsert({
      where: { studentId_lessonId: { studentId: student.id, lessonId } },
      create: {
        studentId: student.id,
        lessonId,
        checkInAt: Date.now(),
      },
      update: { checkInAt: Date.now() },
    });
    return new AttendanceEntity(attendance);
  }

  async comment({ lessonId, comment }: CommentAttendanceDto, userId: number) {
    const student = await this.prisma.student.findFirstOrThrow({
      where: {
        userId,
        classroom: { lessons: { some: { id: lessonId } } },
      },
    });
    const attendance = await this.prisma.attendance.upsert({
      where: { studentId_lessonId: { studentId: student.id, lessonId } },
      create: {
        studentId: student.id,
        lessonId,
        comment,
        commentTime: Date.now(),
      },
      update: { comment, commentTime: Date.now() },
    });
    return new AttendanceEntity(attendance);
  }

  async compareFace(referenceImageFile: File, uploadedImageBase64: string) {
    if (!referenceImageFile) {
      throw new ForbiddenException('Chưa cài đặt hình ảnh để so sánh');
    }
    if (!uploadedImageBase64) {
      throw new BadRequestException('Hình ảnh không có dữ liệu');
    }

    const base64Data = uploadedImageBase64.replace(
      /^data:image\/\w+;base64,/,
      '',
    );
    const uploadedImageBuffer = Buffer.from(base64Data, 'base64');

    let referenceImageArrayBuffer;

    try {
      const response = await fetch(referenceImageFile.url);
      if (!response.ok) {
        throw await response.json();
      }
      referenceImageArrayBuffer = await response.arrayBuffer();
    } catch (error) {
      console.log('Lấy hình ảnh thất bại', error);
      throw new ForbiddenException(
        'Không lấy được hình ảnh đã cài đặt để so sánh',
      );
    }

    const form = new FormData();
    form.append('files', new Blob([uploadedImageBuffer]), 'uploaded-image.jpg');
    form.append(
      'files',
      new Blob([new Uint8Array(referenceImageArrayBuffer)]),
      'reference-image.jpg',
    );

    const faceRecognitionServiceUrl = this.config.get(
      'FACE_RECOGNITION_SERVICE',
    );

    try {
      const response = await fetch(
        `${faceRecognitionServiceUrl}/compare-faces`,
        { method: 'POST', body: form },
      );
      if (!response.ok) {
        throw await response.json();
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Xác thực khuôn mặt thất bại', error);
      throw new ForbiddenException('Xác thực khuôn mặt thất bại. Hãy thử lại');
    }
  }
}
