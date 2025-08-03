import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const res = context.switchToHttp().getResponse();

    if (err || !user) {
      throw new UnauthorizedException(
        err?.message ||
          info?.message ||
          'Invalid refresh token. You need to log in again.',
      );
    }

    return user;
  }
}
