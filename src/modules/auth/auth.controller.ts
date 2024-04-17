import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/database/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Successful Register' })
@ApiResponse({ status: 401, description: 'Failed Register' })
  register(@Body() registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.authService.register(registerUserDto);
  }
@Post('login')
@ApiResponse({ status: 201, description: 'Successful Login' })
@ApiResponse({ status: 401, description: 'Failed Login' })
@UsePipes(ValidationPipe)
  login(@Body() loginUserDto: LoginUserDto): Promise<UserEntity> {
    return this.authService.login(loginUserDto);
  }
  @Post('refresh-token')
  refreshToken(@Body() {refresh_token}): Promise<any> {
    return this.authService.refreshToken(refresh_token);
  }
}
