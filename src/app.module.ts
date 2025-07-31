import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { TicketsModule } from './tickets/tickets.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { IpTrackerModule } from './ip-tracker/ipTracker.module';
import { IpTrackerMiddleware } from './middlewares/ip-tracker/ipTracker.middleware';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { UploaderModule } from './uploader/uploader.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make the config module available globally for use .env variables
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '../**/entities/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    AddressModule,
    TicketsModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    IpTrackerModule,
    UploaderModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpTrackerMiddleware).forRoutes('*'); // OR
    // .forRoutes({path : 'users' , method : RequestMethod.POST}); // OR
    // .forRoutes(UsersController)
  }
}
