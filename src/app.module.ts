import { DataSourceOptions } from 'typeorm';

import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './configs/ormconfig';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { CharacterModule } from './modules/character/character.module';
import { CommentModule } from './modules/comment/comment.module';
import { FavouriteModule } from './modules/favourite/favourite.module';
import { InfoModule } from './modules/info/info.module';
import { PostModule } from './modules/post/post.module';
import { SaleModule } from './modules/sale/sale.module';
import { SeriesModule } from './modules/series/series.module';
import { CartModule } from './modules/cart/cart.module';
import { ProductModule } from './modules/product/product.module';
import { AuthService } from './modules/auth/auth.service';
import { UserEntity } from './modules/databases/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HistoryModule } from './modules/history/history.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,  '../../uploads'),
    }),
    AuthModule,
    UserModule,
    BrandModule,
    HistoryModule,
    CategoryModule,
    CharacterModule,
    CommentModule,
    FavouriteModule,
    InfoModule,
    PostModule,
    SaleModule,
    SeriesModule,
    CartModule,
    ProductModule,
    ConfigModule.forRoot(),
    MulterModule.register({dest: './uploads'}),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  async onModuleInit() {
    await this.authService.checkDefaultAdmin();
  }
}
