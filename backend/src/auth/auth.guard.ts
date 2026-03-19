import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './constant';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    console.log(`[AuthGuard] ${request.method} ${request.url} | token: ${token ? token.substring(0, 20) + '...' : 'AUSENTE'}`);

    if (!token) {
      console.log('[AuthGuard] REJEITADO: token ausente no header');
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
      });
      console.log(`[AuthGuard] Token válido | sub: ${payload.sub} | exp: ${new Date(payload.exp * 1000).toISOString()}`);

      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        console.log(`[AuthGuard] REJEITADO: usuário ${payload.sub} não encontrado`);
        throw new UnauthorizedException();
      }

      request['user'] = user;
    } catch (err) {
      console.log(`[AuthGuard] REJEITADO: ${err.message}`);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
