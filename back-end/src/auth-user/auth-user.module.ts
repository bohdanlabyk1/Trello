import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthUserService } from './auth-user.service';
import { AuthUserController } from './auth-user.controller';
import { Auth } from './auth-user.entiti';
import { JwtAuthGuard } from './jwt-auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({
      secret: 'SUPER_SECRET_JWT_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthUserService, JwtAuthGuard],
  controllers: [AuthUserController],
  exports: [JwtAuthGuard, JwtModule], // щоб можна було імпортувати в інші модулі
})
export class AuthUserModule {}
