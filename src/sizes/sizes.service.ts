import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UUID } from 'crypto';

@Injectable()
export class SizesService {
  constructor(private prismaService: PrismaService) {}

  async create(createSizeDto: CreateSizeDto) {
    try {
      // kiểm tra size tồn tại
      const checkSizeExist = await this.findOneName(createSizeDto.name);
      if (checkSizeExist.data) {
        throw new HttpException(
          'Kích thước đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      // tạo mới size
      const newSize = await this.prismaService.size.create({
        data: {
          id: uuidv4(),
          name: createSizeDto.name,
        },
      });
      return {
        message: 'Tạo mới kích thước thành công',
        status: HttpStatus.CREATED,
        data: newSize,
      };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const sizes = await this.prismaService.size.findMany();
      return { message: null, status: HttpStatus.OK, data: sizes };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneName(name: string) {
    try {
      const size = await this.prismaService.size.findUnique({
        where: {
          name: name,
        },
      });
      return { message: null, status: HttpStatus.OK, data: size };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: UUID) {
    try {
      const size = await this.prismaService.size.findUnique({
        where: {
          id: id,
        },
      });
      return { message: null, status: HttpStatus.OK, data: size };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(updateSizeDto: UpdateSizeDto) {
    try {
      const updateSize = await this.prismaService.size.update({
        where: {
          id: updateSizeDto.id,
        },
        data: {
          name: updateSizeDto.name,
        },
      });
      return {
        message: 'Cập nhật kích thước thành công',
        status: HttpStatus.OK,
        data: updateSize,
      };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: UUID) {
    try {
      await this.prismaService.size.delete({
        where: {
          id: id,
        },
      });
      return {
        message: 'Xoá kích thước thành công',
        status: HttpStatus.OK,
        data: null,
      };
    } catch (error) {}
  }
}
