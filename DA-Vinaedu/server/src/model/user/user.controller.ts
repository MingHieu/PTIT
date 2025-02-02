import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser, Public } from 'src/auth/decorator';
import { SaveUserSettingsDto, UpdatePasswordDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser('userId') userId: number) {
    return this.userService.findOne(userId);
  }

  @Post('update')
  update(@GetUser('userId') userId: number, @Body() body: UpdateUserDto) {
    return this.userService.update(userId, body);
  }

  @Post('update-password')
  updatePassword(
    @GetUser('userId') userId: number,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(userId, body);
  }

  @Post('update-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @GetUser('userId') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(userId, file);
  }

  @Get('verify')
  getVerifyEmail(@GetUser('userId') userId: number) {
    return this.userService.getVerifyEmail(userId);
  }

  @Public()
  @Post('verify')
  verifyUser(@Query('token') token: string) {
    return this.userService.verifyUser(token);
  }

  @Get('settings')
  getUserSettings(@GetUser('userId') userId: number) {
    return this.userService.getUserSettings(userId);
  }

  @Post('settings')
  saveUserSettings(
    @Body() body: SaveUserSettingsDto,
    @GetUser('userId') userId: number,
  ) {
    return this.userService.saveUserSettings(body, userId);
  }
}
