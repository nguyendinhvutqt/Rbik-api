import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

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

  async findOne(id: string) {
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

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
