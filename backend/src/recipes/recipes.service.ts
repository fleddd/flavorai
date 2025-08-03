import { Injectable } from '@nestjs/common';
import { CuisineType, Prisma, Recipe } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';
import { PaginatedResponse, SearchParams } from 'src/common/types';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecipe(userId: string, data: CreateRecipeDto) {
    const ingredientIds = data.ingredients.map((i) => i.ingredientId);
    const existingIngredients = await this.prisma.ingredient.findMany({
      where: { id: { in: ingredientIds } },
    });

    if (existingIngredients.length !== ingredientIds.length) {
      throw new Error('Some ingredients were not found');
    }

    return this.prisma.recipe.create({
      data: {
        title: data.title,
        timeToCook: data.timeToCook,
        description: data.description,
        instructions: data.instructions,
        cuisineType: data.cuisineType,
        imageUrl: data.imageUrl,
        author: { connect: { id: userId } },
        ingredients: {
          create: data.ingredients.map((i) => ({
            quantity: i.quantity,
            weight: i.weight,
            ingredient: { connect: { id: i.ingredientId } },
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async searchUserRecipes(
    userId: string,
    params: SearchParams,
  ): Promise<PaginatedResponse<Recipe[]>> {
    const {
      query,
      cuisines = [],
      timeMin,
      timeMax,
      page = 1,
      limit = 10,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.RecipeWhereInput = {
      authorId: userId,
      ...(query && {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      }),
      ...(cuisines.length > 0 && {
        cuisineType: {
          in: cuisines.filter((c): c is CuisineType =>
            Object.values(CuisineType).includes(c as CuisineType),
          ),
        },
      }),
      ...(timeMin !== undefined || timeMax !== undefined
        ? {
            timeToCook: {
              ...(timeMin !== undefined ? { gte: timeMin } : {}),
              ...(timeMax !== undefined ? { lte: timeMax } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.recipe.findMany({
        where,
        skip,
        take: limit,
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      }),
      this.prisma.recipe.count({ where }),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRecipeById(id: string) {
    return this.prisma.recipe.findUnique({
      where: {
        id,
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async getAllById(userId: string) {
    return this.prisma.recipe.findMany({
      where: {
        authorId: userId,
      },
    });
  }

  async updateRecipeById(id: string, data: UpdateRecipeDto) {
    return this.prisma.recipe.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        timeToCook: data.timeToCook,
        description: data.description,
        instructions: data.instructions,
        cuisineType: data.cuisineType,
        imageUrl: data.imageUrl,
      },
    });
  }
  async deleteRecipeById(id: string) {
    return await this.prisma.$transaction([
      this.prisma.recipeIngredient.deleteMany({ where: { recipeId: id } }),
      this.prisma.recipe.delete({ where: { id } }),
    ]);
  }
  async rateRecipe(recipeId: string, rating: number) {
    return await this.prisma.recipe.update({
      where: { id: recipeId },
      data: { rating },
    });
  }
}
