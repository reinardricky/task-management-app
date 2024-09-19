import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';  
import { LoginUserDto } from './dto/login-user.dto'; 
import { UpdateUserDto } from './dto/update-user.dto'; 

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Put(':id')
  async updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Delete(':id')
  async deleteProfile(@Param('id') id: string) {
    return this.userService.deleteProfile(id);
  }
}
