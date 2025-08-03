import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;

  currentPlanId: string | null;
}
