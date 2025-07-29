// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Product } from '@/products/entities/product.entity';
import { LoggerMiddleware } from '@/middlewares/logger/logger.middleware';
// import { LoggerMiddleware } from '@/middlewares/logger/logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users'); // OR
    // .forRoutes({path : 'users' , method : RequestMethod.POST}); // OR
    // .forRoutes(UsersController)
  }
}
