import { UsersService } from './../users/users.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(createAuthDto: CreateUserDto) {
    const validUser = await this.validateUser(createAuthDto);
    return await this.generateToken(validUser);
  }

  async register(createAuthDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(
      createAuthDto.email,
    );

    if (candidate) {
      throw new HttpException('User exist', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(createAuthDto.password, 5);

    const user = await this.usersService.createUser({
      ...createAuthDto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(userDto.email);

    if (!user) {
      throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST);
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (!passwordEquals) {
      throw new UnauthorizedException({ message: 'Incorrect credentials' });
    }

    return user;
  }
}
