import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { UserQueryDto } from './dto/user-query.dto';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

// @ApiExcludeController() // For not show controller in swagger
@ApiTags('manage-users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @Post()
  @ApiOperation({ summary: 'Create user' })
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
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'user fetched successfully',
      data: user,
    });
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(id, updateUserDto);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'user updated successfully',
      data: null,
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.usersService.remove(id);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'user deleted successfully',
      data: null,
    });
  }
}
