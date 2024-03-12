import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidEmail } from 'src/ultils/validateEmail';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    // kiểm tra định dạng email
    const checkIsValidEmail = isValidEmail(createUserDto.email);
    if (!checkIsValidEmail) {
      throw new HttpException(
        'Email không đúng định dạng',
        HttpStatus.BAD_REQUEST,
      );
    }
    // kiểm tra email tồn tại
    const checkEmailExist = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (checkEmailExist) {
      throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
    }
    // mã hoá mật khẩu
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    // tạo mới người dùng
    const newUser = await this.prismaService.user.create({
      data: {
        id: uuidv4(),
        email: createUserDto.email,
        name: createUserDto.email,
        password: hashPassword,
      },
    });
    if (!newUser) {
      throw new HttpException(
        'Có lỗi xảy ra vui lòng thử lại',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { message: 'Tạo mới người dùng thành công' };
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneByEmail(email: string): Promise<any> {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  findOne(id: UUID) {
    return `This action returns a #${id} user`;
  }

  update(id: UUID, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: UUID) {
    return `This action removes a #${id} user`;
  }
}
