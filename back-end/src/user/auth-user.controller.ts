import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthUserService } from './auth-user.service';

import { JwtAuthGuard } from './jwt-auth';

import { RolesGuard } from './roles.guard';

import { Roles } from './role.decorator';

@Controller('auth-user')
export class AuthUserController {

  constructor(
    private readonly authUserService: AuthUserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  changeRole(
    @Param('id') id: number,
    @Body('role') role: string,
  ) {
    return this.authUserService.changeRole(
      Number(id),
      role,
    );
  }

  @Post('register')
  async register(
    @Body()
    body: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      repit_password: string;
    },
  ) {

    const {
      last_name,
      first_name,
      email,
      password,
      repit_password,
    } = body;

    try {

      const user =
        await this.authUserService.register(
          last_name,
          first_name,
          email,
          password,
          repit_password,
        );

      const token =
        this.authUserService.generateJwtToken(user);

      return {
        status: 'success',
        message: 'Реєстрація успішна!',
        token,
      };

    } catch (error:any) {

      throw new BadRequestException(
        error.message,
      );
    }
  }

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {

    const { email, password } = body;

    try {

      const { user, token } =
        await this.authUserService.login(
          email,
          password,
        );

      return {
        status: 'success',
        message: 'Авторизація успішна!',
        token,
        user,
      };

    } catch (error:any) {

      throw new UnauthorizedException(
        error.message,
      );
    }
  }
}