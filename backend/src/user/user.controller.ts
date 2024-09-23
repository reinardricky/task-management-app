import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getProfile(@Param('id') id: number) {
    return this.userService.getProfile(id);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
