import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async createIngredient(name: string) {
    return this.prisma.ingredient.create({
      data: { name },
    });
  }

  async getAllIngredients() {
    return this.prisma.ingredient.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getIngredientById(id: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });
    if (!ingredient) throw new NotFoundException('Ingredient not found');
    return ingredient;
  }

  async updateIngredient(id: string, name: string) {
    return this.prisma.ingredient.update({
      where: { id },
      data: { name },
    });
  }

  async deleteIngredient(id: string) {
    return this.prisma.ingredient.delete({ where: { id } });
  }
}
