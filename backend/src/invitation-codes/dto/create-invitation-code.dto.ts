import { IsEnum, IsString } from "class-validator";
import { InvitationRole } from "../../generated/prisma/enums";

export class CreateInvitationCodeDto {
  @IsString()
  code!: string;

  @IsEnum(InvitationRole)
  role!: InvitationRole;
}
