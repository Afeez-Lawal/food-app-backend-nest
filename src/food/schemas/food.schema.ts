import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from '../../restaurant/schemas/restaurant.schema';

export type FoodDocument = HydratedDocument<Food>;

@Schema()
export class Food {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }] })
  restaurant: Restaurant;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
