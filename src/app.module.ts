import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesModule } from './invoices/invoices.module';
import { InvoicesService } from './invoices/invoices.service';

@Module({
  imports: [AuthModule, PrismaModule, InvoicesModule],
  controllers: [InvoicesController],
  providers: [InvoicesService]
})
export class AppModule {}
