import { InputJsonObject } from '@prisma/client/runtime/library';

export class CreateNotificationDto {
  title: string;
  message: string;
  data?: NotificationData;
  userId: number;
}

interface NotificationData extends InputJsonObject {
  url?: string;
}
