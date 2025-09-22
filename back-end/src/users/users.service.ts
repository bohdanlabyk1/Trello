import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users: Array<{ id: number; email: string; password: string }> = [];

  constructor(private jwtService: JwtService) {
    this.initializeUsers();
  }

  private async initializeUsers() {
    const hashedPassword = await bcrypt.hash('123456', 10);
    this.users.push({ id: 1, email: 'test@test.com', password: hashedPassword });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.users.find((u) => u.email === email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword };
    this.users.push(newUser);
    return { message: 'User registered successfully' };
  }
}
