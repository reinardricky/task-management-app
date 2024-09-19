import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';  // Import the User entity

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Register the User entity with TypeORM
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],  // Export UserService if needed in other modules
})
export class UserModule {}
