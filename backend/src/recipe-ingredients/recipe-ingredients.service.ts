import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipeIngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertRecipeIngredient(
    recipeId: string,
    ingredientId: string,
    quantity: string,
    weight?: number,
  ) {
    // const ingredient = await this.prisma.ingredient.upsert({
    //     where: { id: ingredientId },
    //     update: {},
    //     create: { name: ingredientName },
    // });

    return this.prisma.recipeIngredient.upsert({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
      update: { quantity },
      create: {
        recipeId,
        ingredientId,
        quantity,
        weight,
      },
    });
  }

  async removeRecipeIngredient(recipeId: string, ingredientId: string) {
    return this.prisma.recipeIngredient.delete({
      where: {
        recipeId_ingredientId: {
          recipeId,
          ingredientId,
        },
      },
    });
  }

  async getIngredientsForRecipe(recipeId: string) {
    return this.prisma.recipeIngredient.findMany({
      where: { recipeId },
      include: { ingredient: true },
    });
  }
}
