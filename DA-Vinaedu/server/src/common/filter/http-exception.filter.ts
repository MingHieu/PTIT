import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorResponse } from '../response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log(exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi không xác định';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Bản ghi không tồn tại';
          break;
        case 'P2002':
          status = HttpStatus.BAD_REQUEST;
          message = 'Dữ liệu ràng buộc không hợp lệ';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Dữ liệu ràng buộc không hợp lệ';
          break;
        case 'P2000':
          status = HttpStatus.BAD_REQUEST;
          message = 'Dữ liệu đầu vào không hợp lệ';
          break;
        case 'P2014':
          status = HttpStatus.BAD_REQUEST;
          message = 'Dữ liệu ràng buộc không hợp lệ';
          break;
        default:
          message = 'Lỗi cơ sở dữ liệu';
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as any;
      if (typeof message === 'object' && message !== null) {
        message =
          (message as any).message ||
          (message as any).error ||
          'Lỗi không xác định';
      }
    }

    response.status(status).json(ErrorResponse(message));
  }
}
