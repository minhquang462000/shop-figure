import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/database/user.entity';
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: '462000',
      signOptions: { expiresIn: '1h' },
    }),ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
