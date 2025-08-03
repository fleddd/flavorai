import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateRecipeDto,
  DeleteRecipeDto,
  RateRecipeDto,
  UpdateRecipeDto,
} from './dto/recipe.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'generated/prisma';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { RecipesService } from './recipes.service';

@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  createRecipe(@CurrentUser() user: User, @Body() data: CreateRecipeDto) {
    return this.recipesService.createRecipe(user.id, data);
  }
  @Get('search')
  searchRecipes(
    @CurrentUser() user: User,
    @Query('query') query?: string,
    @Query('cuisines') cuisines?: string,
    @Query('timeMin') timeMin?: string,
    @Query('timeMax') timeMax?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.recipesService.searchUserRecipes(user.id, {
      query,
      cuisines: cuisines?.split(',') ?? [],
      timeMin: timeMin ? parseInt(timeMin) : undefined,
      timeMax: timeMax ? parseInt(timeMax) : undefined,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }

  @Get('my')
  getMyRecipes(@CurrentUser() user: User) {
    return this.recipesService.getAllById(user.id);
  }

  @Get(':id')
  getRecipeById(@Param('id') id: string) {
    return this.recipesService.getRecipeById(id);
  }

  @Put(':id')
  updateRecipe(@Param('id') id: string, @Body() data: UpdateRecipeDto) {
    return this.recipesService.updateRecipeById(id, data);
  }

  @Delete(':id')
  deleteRecipe(@Param('id') data: string) {
    return this.recipesService.deleteRecipeById(data);
  }

  @Post('/rate/:id')
  rateRecipe(@Param('id') recipeId: string, @Body() data: RateRecipeDto) {
    return this.recipesService.rateRecipe(recipeId, data.rating);
  }
}
