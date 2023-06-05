import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './schemas/food.schema';

@Injectable()
export class FoodService {
  constructor(@InjectModel(Food.name) private foodModel: Model<Food>) {}

  async create(createFoodDto: CreateFoodDto) {
    const createdFood = new this.foodModel(createFoodDto);
    return await createdFood.save();
  }

  async findAll() {
    return await this.foodModel.find();
  }

  async findOne(id: string) {
    return await this.foodModel.findById(id).exec();
  }

  async update(id: string, updateFoodDto: UpdateFoodDto) {
    const updatedFood = await this.foodModel.findByIdAndUpdate(
      id,
      updateFoodDto,
      {
        new: true,
      },
    );
    return updatedFood;
  }

  async remove(id: string) {
    return await this.foodModel.findByIdAndDelete(id);
  }
}
