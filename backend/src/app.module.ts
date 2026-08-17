import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { EventsModule } from './events/events.module';
import { AttendanceModule } from './attendance/attendance.module';
import { InvitationCodesModule } from './invitation-codes/invitation-codes.module';
import { SwapRequestsModule } from './swap-requests/swap-requests.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    EventsModule,
    AttendanceModule,
    InvitationCodesModule,
    SwapRequestsModule,
    UsersModule,
    TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
