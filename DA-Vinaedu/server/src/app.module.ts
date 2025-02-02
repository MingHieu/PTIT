import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { S3 } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { FileModule } from './file/file.module';
import { AssignmentModule } from './model/assignment/assignment.module';
import { AttendanceModule } from './model/attendance/attendance.module';
import { ClassroomModule } from './model/classroom/classroom.module';
import { ExamModule } from './model/exam/exam.module';
import { LessonModule } from './model/lesson/lesson.module';
import { MaterialModule } from './model/material/material.module';
import { QuestionModule } from './model/question/question.module';
import { StudentModule } from './model/student/student.module';
import { SubmissionModule } from './model/submission/submission.module';
import { UserModule } from './model/user/user.module';
import { NotificationModule } from './notification/notification.module';
import { WebsocketModule } from './websocket/websocket.module';
import { MeetingModule } from './meeting/meeting.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          name: config.get('APP_DOMAIN'),
          host: config.get('EMAIL_HOST'),
          port: 587,
          secure: false,
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (config: ConfigService) => ({
          region: config.get('AWS_REGION'),
          credentials: {
            accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
          },
        }),
        inject: [ConfigService],
      },
      services: [S3],
    }),
    PrismaModule,
    WebsocketModule,
    FileModule,
    NotificationModule,
    EmailModule,
    AuthModule,
    UserModule,
    ClassroomModule,
    StudentModule,
    LessonModule,
    AttendanceModule,
    AssignmentModule,
    ExamModule,
    MaterialModule,
    QuestionModule,
    SubmissionModule,
    MeetingModule,
  ],
})
export class AppModule {}
