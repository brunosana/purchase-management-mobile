import Realm, {ObjectSchema} from 'realm';
import {Schemas} from '../realm/constants';

export class ProductItemSchema extends Realm.Object<ProductItemSchema> {
  name!: string;
  price!: number;
  oldPrice?: number;
  quantity!: number;
  type!: string;

  static schema: ObjectSchema = {
    name: Schemas.PRODUCT_ITEM,
    embedded: true,
    properties: {
      name: 'string',
      price: 'float',
      oldPrice: 'float?',
      quantity: 'int',
      type: 'string',
    },
  };
}
