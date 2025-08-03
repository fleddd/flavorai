import { IsNotEmpty, IsString } from 'class-validator';

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
