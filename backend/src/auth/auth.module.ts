import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { OptionalAuthGuard } from './optional-auth.guard';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from './constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, OptionalAuthGuard],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  exports: [AuthService, AuthGuard, OptionalAuthGuard, JwtModule],
})
export class AuthModule {}
