import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verifyHash } from './utils';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'generated/prisma';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async verifyUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(
        'User not found. This email is not registered.',
      );
    }

    if (!user.password) {
      throw new BadRequestException(
        'This account does not have a passoword associated with it. Try to log in with a different method.',
      );
    }

    const isPasswordValid = await verifyHash(user.password, password);

    if (!isPasswordValid) {
      throw new BadRequestException(
        'Invalid email or password. Please try again.',
      );
    }

    return user;
  }
  async login(user: User, response: Response) {
    const now = Date.now();

    const accessTokenExpiresInMs = parseInt(
      this.configService.getOrThrow('JWT_ACCESS_EXPIRATION_TIME_MS'),
    );
    const refreshTokenExpiresInMs = parseInt(
      this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_TIME_MS'),
    );

    const expiresAccessToken = new Date(now + accessTokenExpiresInMs);
    const expiresRefreshToken = new Date(now + refreshTokenExpiresInMs);

    const tokenPayload = {
      userId: user.id,
    };

    const accessToken = this.generateJwtToken(
      tokenPayload,
      this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      accessTokenExpiresInMs,
    );

    const refreshToken = this.generateJwtToken(
      tokenPayload,
      this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      refreshTokenExpiresInMs,
    );

    response.cookie('Authentication', accessToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: this.configService.getOrThrow('NODE_ENV') == 'production',
      expires: expiresAccessToken,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.configService.getOrThrow('NODE_ENV') == 'production',
      expires: expiresRefreshToken,
    });

    const hashedRefreshToken = await hash(refreshToken);

    await this.usersService.updateUserById(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return user;
  }
  async registerUser(email: string, password: string) {
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException(
        'Email already registered. Please use a different email.',
      );
    }

    const hashedPassword = await hash(password);

    await this.usersService.createUser(email, hashedPassword);
    return {
      message: 'User was successfuly registered, log in to account',
    };
  }
  async verifyRefreshToken(refreshTokenToVerify: string, userId: string) {
    const user = await this.usersService.findUserById(userId);

    if (!user || !user.refreshToken) {
      throw new BadRequestException('Invalid refresh token.');
    }

    const isRefreshTokenValid = await verifyHash(
      user.refreshToken,
      refreshTokenToVerify,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException(
        'Invalid refresh token. You need to log in again.',
      );
    }

    return user;
  }

  async refreshAccessToken(user: User, response: Response) {
    const now = Date.now();
    const accessTokenExpiresInMs = parseInt(
      this.configService.getOrThrow('JWT_ACCESS_EXPIRATION_TIME_MS'),
    );

    const expiresAccessToken = new Date(now + accessTokenExpiresInMs);

    const tokenPayload = {
      userId: user.id,
    };

    const accessToken = this.generateJwtToken(
      tokenPayload,
      this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      accessTokenExpiresInMs,
    );

    response.cookie('Authentication', accessToken, {
      sameSite: 'lax',
      secure: this.configService.getOrThrow('NODE_ENV') == 'production',
      httpOnly: true,
      expires: expiresAccessToken,
    });

    return user;
  }

  async logout(user: User, res: Response) {
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');

    await this.usersService.updateUserById(user.id, { refreshToken: null });
  }
  private generateJwtToken(
    payload: object,
    secret: string,
    expiresInMs: number,
  ): string {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: `${expiresInMs}ms`,
    });
  }
}
