import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('JWT не надано');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('JWT не надано');

    try {
      const payload = this.jwtService.verify(token, { secret: 'SUPER_SECRET_JWT_KEY' });
      request['user'] = payload; // додаємо user у req
      return true;
    } catch (err) {
      throw new UnauthorizedException('Невірний токен');
    }
  }
}
