import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity'; // Adjust path as needed
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: { email: string; password: string }) {
    const userEntity = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    if (userEntity.authProvider === 'local') {
      const isPasswordValid = await bcrypt.compare(
        user.password,
        userEntity.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
    }

    const payload = {
      email: userEntity.email,
      roles: userEntity.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      authProvider: 'local',
      roles: ['user'],
    });
    return this.userRepository.save(user);
  }

  // Handle OAuth user creation (no password)
  async handleOAuthUser(profile: any, provider: string) {
    const email = profile.emails[0].value;
    let user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      // Update existing user with new OAuth information
      user.googleId = profile.id;
      user.authProvider = provider;
    } else {
      user = this.userRepository.create({
        email: profile.emails[0].value,
        authProvider: provider,
        googleId: profile.id,
        password: null,
        roles: ['user'],
      });
    }
    return this.userRepository.save(user);
  }
}
