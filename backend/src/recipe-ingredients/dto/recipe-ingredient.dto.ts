// recipe-ingredient.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class RecipeIngredientDto {
  @IsString()
  @IsNotEmpty()
  ingredientId: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number; // optional weight field
}
