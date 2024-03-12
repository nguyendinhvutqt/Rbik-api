import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prismaService: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const checkBrandExist = await this.prismaService.brand.findFirst({
        where: {
          name: createBrandDto.name,
        },
      });
      if (checkBrandExist) {
        throw new HttpException(
          'Tên nhãn nhiệu đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      const createBrand = await this.prismaService.brand.create({
        data: { id: uuidv4(), name: createBrandDto.name },
      });
      return {
        message: 'Tạo mới nhãn hiệu thành công',
        status: HttpStatus.CREATED,
        data: createBrand,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const brands = await this.prismaService.brand.findMany();
      return {
        message: null,
        status: HttpStatus.OK,
        data: brands,
      };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const brand = await this.prismaService.brand.findFirst({
        where: {
          id: id,
        },
      });
      return {
        message: null,
        status: HttpStatus.OK,
        data: brand,
      };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByName(name: string) {
    try {
      const brand = await this.prismaService.brand.findFirst({
        where: {
          name: name,
        },
      });
      return {
        message: null,
        status: HttpStatus.OK,
        data: brand,
      };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(updateBrandDto: UpdateBrandDto) {
    try {
      const updateBrand = await this.prismaService.brand.update({
        where: {
          id: updateBrandDto.id,
        },
        data: {
          name: updateBrandDto.name,
        },
      });
      return {
        message: 'Cập nhật nhãn hiệu thành công',
        status: HttpStatus.OK,
        data: updateBrand,
      };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.brand.delete({
        where: {
          id: id,
        },
      });
      return {
        message: 'Xoá nhãn hiệu thành công',
        status: HttpStatus.OK,
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
