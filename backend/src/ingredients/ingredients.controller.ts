import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { IngredientDto } from './dto/ingredient.dto';

@UseGuards(JwtAuthGuard)
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  findAll() {
    return this.ingredientsService.getAllIngredients();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientsService.getIngredientById(id);
  }
  @Post()
  create(@Body() createDto: IngredientDto) {
    return this.ingredientsService.createIngredient(createDto.name);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: IngredientDto) {
    return this.ingredientsService.updateIngredient(id, updateDto.name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientsService.deleteIngredient(id);
  }
}
