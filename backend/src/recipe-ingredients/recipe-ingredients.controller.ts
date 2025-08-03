import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RecipeIngredientsService } from './recipe-ingredients.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { RecipeIngredientDto } from './dto/recipe-ingredient.dto';

@UseGuards(JwtAuthGuard)
@Controller('recipe-ingredients')
export class RecipeIngredientsController {
  constructor(
    private readonly recipeIngredientsService: RecipeIngredientsService,
  ) {}

  @Post(':recipeId')
  upsertIngredient(
    @Param('recipeId') recipeId: string,
    @Body() data: RecipeIngredientDto,
  ) {
    return this.recipeIngredientsService.upsertRecipeIngredient(
      recipeId,
      data.ingredientId,
      data.quantity,
      data.weight,
    );
  }

  @Delete(':recipeId/:ingredientId')
  removeIngredient(
    @Param('recipeId') recipeId: string,
    @Param('ingredientId') ingredientId: string,
  ) {
    return this.recipeIngredientsService.removeRecipeIngredient(
      recipeId,
      ingredientId,
    );
  }

  @Get(':recipeId')
  getIngredients(@Param('recipeId') recipeId: string) {
    return this.recipeIngredientsService.getIngredientsForRecipe(recipeId);
  }
}
