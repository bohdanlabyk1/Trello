import { Module } from '@nestjs/common';
import { AuthService } from './users.service';
import { AuthController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './users.strategi';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // Секрет для JWT
      signOptions: { expiresIn: '1h' }, // Время жизни токена
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
