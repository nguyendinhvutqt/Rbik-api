import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidEmail } from 'src/ultils/validateEmail';
import { UUID } from 'crypto';
import { ChangePasswordDto } from './dto/change-pasword.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  // đăng kí người dùng
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

  // lấy tất cả người dùng
  async findAll() {
    const users = await this.prismaService.user.findMany();
    return { message: null, status: HttpStatus.OK, data: users };
  }

  // lấy người dùng theo email
  async findOneByEmail(email: string): Promise<any> {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  // Lấy người dùng theo id
  async findOne(id: UUID) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    return { message: null, status: HttpStatus.OK, data: user };
  }

  // thay đổi mật khẩu
  async changePassword(userId: UUID, changePasswordDto: ChangePasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (
      !user ||
      !(await bcrypt.compare(changePasswordDto.password, user?.password))
    ) {
      throw new HttpException('Mật khẩu cũ không khớp', HttpStatus.BAD_REQUEST);
    }

    // kiểm tra mật khẩu mới và có khớp hay không
    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      throw new HttpException(
        'Mật khẩu mới không khớp',
        HttpStatus.BAD_REQUEST,
      );
    }

    // hash password và lưu
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltOrRounds,
    );

    const updateUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashPassword,
      },
    });
    return {
      message: 'Thay đổi mật khẩu thành công',
      status: HttpStatus.OK,
      data: updateUser,
    };
  }

  // cập nhật người dùng
  async update(id: UUID, updateUserDto: UpdateUserDto) {
    const updateUser = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        address: updateUserDto.address,
      },
    });
    return {
      message: 'Cập nhật thông tin thành công',
      status: HttpStatus.OK,
      data: updateUser,
    };
  }

  // xoá người dùng
  async remove(id: UUID) {
    await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
    return {
      message: 'Xoá người dùng thành công',
      status: HttpStatus.OK,
      data: null,
    };
  }
}
