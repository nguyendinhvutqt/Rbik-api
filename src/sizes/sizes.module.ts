import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SizesController],
  providers: [SizesService, PrismaService],
})
export class SizesModule {}
