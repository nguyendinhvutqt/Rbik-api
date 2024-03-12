import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user?.password))) {
      throw new UnauthorizedException();
    }
    // TODO: Generate a JWT and return it here
    const payload = {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    // instead of the user object
    return { accessToken };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user?.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
