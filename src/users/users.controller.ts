import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { UserQueryDto } from './dto/user-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    await this.usersService.create(createUserDto);
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'user created successfully',
      data: null,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() userQueryDto: UserQueryDto) {
    const users = await this.usersService.findAll(
      userQueryDto.role,
      userQueryDto.page,
      userQueryDto.limit,
    );
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'users fetched successfully',
      data: users,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
