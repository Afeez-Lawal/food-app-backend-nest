import { ObjectId } from 'mongoose';

export class CreateFoodDto {
  name: string;
  price: string;
  image: string;
  restaurant: ObjectId;
}
