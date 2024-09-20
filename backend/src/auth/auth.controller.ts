import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @ApiOperation({ summary: 'Google OAuth2 login' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Initiates Google login
  }

  @Get('google/redirect')
  @ApiOperation({ summary: 'Google OAuth2 redirect' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // Handles Google redirect and return JWT or user info
    return this.authService.login(req.user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register with email and password' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  async register(@Body() registerDto: { email: string; password: string }) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify JWT token' })
  @UseGuards(AuthGuard('jwt'))
  async verify(@Req() req) {
    return req.user;
  }
}
