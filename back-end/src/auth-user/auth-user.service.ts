import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository, } from '@nestjs/typeorm';
import { Auth } from './auth-user.entiti';

@Injectable()
export class AuthUserService {
    constructor(
        @InjectRepository(Auth)
        private authRepositori: Repository<Auth>,
        private jwtService: JwtService,
    ) {}

    async register(username: string, email: string, password: string, repit_password: string): Promise<Auth> {
        if (password !== repit_password) {
            throw new HttpException('паролі не співпадають', HttpStatus.BAD_REQUEST);
        }

        const existUser = await this.authRepositori.findOne({ where: { email } });
        if (existUser) {
            throw new HttpException('Користувач з таким email вже існує', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const auth = this.authRepositori.create({
             username,
            email,
            password: hashedPassword,
        });
        return this.authRepositori.save(auth);
    }

    async login(email: string, password: string): Promise<{ user: Auth; token: string }> {
        const user = await this.authRepositori.findOne({ where: { email } });
        if (!user) {
            throw new HttpException('Користувач не знайдений', HttpStatus.NOT_FOUND);
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new HttpException('Невірний пароль', HttpStatus.BAD_REQUEST);
        }

        const token = this.generateJwtToken(user);
        return { user, token };
    }

    public generateJwtToken(user: Auth): string {
        const payload = { email: user.email, username: user.username, id: user.id };
        return this.jwtService.sign(payload);
    }
}
