import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Tạo đơn hàng' })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({ summary: 'Lấy tất cả đơn hàng' })
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Lấy đơn hàng theo userId' })
  @Get('my-orders')
  findByUser(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Lấy đơn hàng theo Id' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.findOneById(id);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Cập nhật đơn hàng' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Xoá đơn hàng' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.remove(id);
  }
}
