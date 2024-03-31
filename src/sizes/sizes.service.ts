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
    // kiểm tra size tồn tại
    const checkSizeExist = await this.findOneName(createSizeDto.name);
    if (checkSizeExist.data) {
      throw new HttpException('Kích thước đã tồn tại', HttpStatus.BAD_REQUEST);
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
  }

  async findAll() {
    const sizes = await this.prismaService.size.findMany();
    return { message: null, status: HttpStatus.OK, data: sizes };
  }

  async findOneName(name: string) {
    const size = await this.prismaService.size.findUnique({
      where: {
        name: name,
      },
    });
    return { message: null, status: HttpStatus.OK, data: size };
  }

  async findOne(id: UUID) {
    const size = await this.prismaService.size.findUnique({
      where: {
        id: id,
      },
    });
    return { message: null, status: HttpStatus.OK, data: size };
  }

  async update(updateSizeDto: UpdateSizeDto) {
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
  }

  async remove(id: UUID) {
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
  }
}
