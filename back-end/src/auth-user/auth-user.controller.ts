import { Body, Controller, Post, BadRequestException, UnauthorizedException} from '@nestjs/common';
import { AuthUserService } from './auth-user.service';

@Controller('auth-user')
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Post('register')
  async register(@Body() body:{username:string, email:string, password:string, repit_password}){
 const { username, email, password, repit_password} = body;
 try{
  const user = await this.authUserService.register (username, email, password, repit_password) 
  const token = await this.authUserService.generateJwtToken(user)
    return { status: 'success', message: 'Реєстрація успішна!', token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
 }
 @Post('login')
 async login(@Body() body:{email:string, password:string}){
  const{ email, password} = body;
  try {
    const { user, token } = await this.authUserService.login(email, password);
      return { status: 'success', message: 'Авторизація успішна!', token, user };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
 }
  }
