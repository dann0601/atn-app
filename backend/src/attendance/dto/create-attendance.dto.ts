import { IsEnum } from "class-validator";
import { AttendanceStatus } from "../../generated/prisma/enums";

export class CreateAttendanceDto {
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;
}
