import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  // tạo đơn hàng
  async create(createOrderDto: CreateOrderDto) {
    // tính tổng tiền đơn hàng
    const totalMoney = createOrderDto.products.reduce((total, product) => {
      return total + product.quantity * product.price;
    }, 0);

    // tạo đơn hàng
    const newOrder = await this.prismaService.order.create({
      data: {
        userId: createOrderDto.userId,
        totalAmount: totalMoney,
      },
    });

    //tạo chi tiết đơn hàng
    const orderProducts = createOrderDto.products.map((product) => ({
      orderId: newOrder.id,
      productId: product.productId,
      quantity: product.quantity,
      price: product.price,
    }));

    await this.prismaService.orderProduct.createMany({
      data: orderProducts,
    });

    return {
      message: 'Tạo mới đơn hàng thành công',
      status: HttpStatus.CREATED,
      data: newOrder,
    };
  }

  // lấy tất cả đơn hàng
  async findAll() {
    const orders = await this.prismaService.order.findMany({
      select: {
        id: true,
        userId: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            address: true,
            avatar: true,
          },
        },
      },
    });
    return { message: null, status: HttpStatus.OK, data: orders };
  }

  // lấy đơn hàng theo id người dùng
  async findByUser(userId: string) {
    const orders = await this.prismaService.order.findMany({
      where: {
        userId: userId,
      },
    });
    return { message: null, status: HttpStatus.OK, data: orders };
  }

  // lấy đơn hàng theo id
  async findOneById(id: string) {
    const order = await this.prismaService.order.findMany({
      where: {
        id: id,
      },
      select: {
        id: true,
        userId: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            address: true,
            avatar: true,
          },
        },
      },
    });
    return { message: null, status: HttpStatus.OK, data: order };
  }

  // cập nhật đơn hàng
  async update(userId: string, updateOrderDto: UpdateOrderDto) {
    const updateOrder = await this.prismaService.order.update({
      where: {
        id: updateOrderDto.id,
      },
      data: {
        status: updateOrderDto.status,
      },
    });
    return {
      message: 'Cập nhật đơn hàng thành công',
      status: HttpStatus.OK,
      data: updateOrder,
    };
  }

  // xoá đơn hàng
  async remove(id: string) {
    await this.prismaService.order.delete({
      where: {
        id: id,
      },
    });
    return {
      message: 'Xoá đơn hàng thành công',
      status: HttpStatus.OK,
      data: null,
    };
  }
}
