import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandsModule } from './brands/brands.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SizesModule } from './sizes/sizes.module';
import { ProductsModule } from './products/products.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    BrandsModule,
    AuthModule,
    UsersModule,
    SizesModule,
    ProductsModule,
    CloudinaryModule,
    OrdersModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
