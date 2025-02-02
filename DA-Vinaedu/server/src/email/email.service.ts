import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendMail({ to, subject, text, html }: CreateEmailDto) {
    const mail = await this.mailerService.sendMail({
      from: this.config.get('APP_NAME') + ' ' + this.config.get('EMAIL_USER'),
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', mail);
    return mail;
  }
}
