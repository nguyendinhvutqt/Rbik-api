import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UUID } from 'crypto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(file: any, createProductDto: CreateProductDto) {
    // kiểm tra sản phẩm tồn tại
    const checkProductExist = await this.prismaService.product.findFirst({
      where: {
        name: createProductDto.name,
      },
    });
    if (checkProductExist) {
      throw new HttpException(
        'Tên sản phẩm đã tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }
    // kiểm tra giá nhập vào lớn hơn 0
    if (createProductDto.price <= 0) {
      throw new HttpException(
        'Giá sản phẩm không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );
    }
    // kiểm tra số lượng sản phẩm nhập vào lớn hơn hoặc bằng 0
    if (createProductDto.price < 0) {
      throw new HttpException(
        'Số lượng sản phẩm không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );
    }
    // tạo thư mục products trên cloudinary
    await this.cloudinaryService.createFolder('products');

    // upload hình ảnh lên cloudinary
    const uploadFile = await this.cloudinaryService.uploadFile(file);

    // tạo và lưu sản phẩm vàodb
    const newProduct = await this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        imageUrl: uploadFile.url,
        imagePublicId: uploadFile.public_id,
        description: createProductDto.description,
        inventoryNumber: createProductDto.quantity,
        brandId: createProductDto.brandId,
        sizeId: createProductDto.sizeId,
      },
    });
    return {
      message: 'Tạo mới sản phẩm thành công',
      status: HttpStatus.CREATED,
      data: newProduct,
    };
  }

  async findAll() {
    const products = await this.prismaService.product.findMany({
      include: {
        brand: true,
        size: true,
      },
    });
    return { message: null, status: HttpStatus.OK, data: products };
  }

  async findOne(id: UUID): Promise<any> {
    const product = await this.prismaService.product.findFirst({
      where: {
        id: id,
      },
    });
    return { message: null, status: HttpStatus.OK, data: product };
  }

  async update(updateProductDto: UpdateProductDto): Promise<any> {
    const updateProduct = await this.prismaService.product.update({
      where: {
        id: updateProductDto.id,
      },
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        inventoryNumber: updateProductDto.quantity,
      },
    });
    return {
      message: 'Thay đổi thông tin sản phẩm thành công',
      status: HttpStatus.OK,
      data: updateProduct,
    };
  }

  async remove(id: UUID) {
    const product = await this.prismaService.product.findFirst({
      where: {
        id: id,
      },
    });
    if (!product) {
      throw new HttpException('Sản phẩm không tồn tại', HttpStatus.BAD_REQUEST);
    }
    await this.prismaService.product.delete({
      where: {
        id: id,
      },
    });
    await this.cloudinaryService.deleteImage('products', product.imagePublicId);
    return {
      message: 'Xoá sản phẩm thành công',
      status: HttpStatus.OK,
      data: null,
    };
  }
}
