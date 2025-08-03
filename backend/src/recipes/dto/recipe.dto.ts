import {
  IsArray,
  IsBase64,
  isBase64,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { $Enums } from 'generated/prisma';
import { Type } from 'class-transformer';
import { IngredientDto } from 'src/ingredients/dto/ingredient.dto';
import { RecipeIngredientDto } from 'src/recipe-ingredients/dto/recipe-ingredient.dto';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1, { message: 'Cooking time must be at least 1 minute' })
  timeToCook: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsEnum($Enums.CuisineType)
  cuisineType: $Enums.CuisineType;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients: RecipeIngredientDto[];
}

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}

export class RateRecipeDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}

export class DeleteRecipeDto {
  @IsString()
  id: string;
}
