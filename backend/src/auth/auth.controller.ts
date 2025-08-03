import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/user.dto';
import { LocalAuthGuard, JwtRefreshAuthGuard, JwtAuthGuard } from './guards';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from 'generated/prisma';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  registerUser(@Body() data: RegisterUserDto) {
    return this.authService.registerUser(data.email, data.password);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  loginUser(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(user, res);
  }
  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshTokens(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshAccessToken(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(200)
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user, res);
  }
}
