import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response } from 'express';
import { AddressQueryDto } from './dto/address-query.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Res() res: Response,
  ) {
    const address = await this.addressService.create(createAddressDto);
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'address created successfully',
      data: address,
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query() addressQueryDto: AddressQueryDto,
  ) {
    const addresses = await this.addressService.findAll(
      addressQueryDto.page,
      addressQueryDto.limit,
    );
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'address fetch successfully',
      data: addresses,
    });
  }

  @Get('get-address-user/:id')
  async findByUserId(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const addresses = await this.addressService.findByUserId(id);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'addresses are found',
      data: addresses,
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const address = await this.addressService.findOne(id);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'address found it',
      data: address,
    });
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    await this.addressService.update(id, updateAddressDto);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'address is update it',
      data: null,
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    await this.addressService.remove(id);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'address is deleted',
      data: null,
    });
  }
}
