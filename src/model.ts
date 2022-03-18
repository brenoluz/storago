import { Schema } from './schema';
import { Select } from './adapters/select';
import { paramsType } from './adapters/query';
import { Create } from './adapters/create';

interface Populate {
  [name: string]: Promise<any>;
}

export class Model {

  public static schema: Schema;
  public __data: Populate = {};

  [prop: string]: any;

  public async save(): Promise<any> {

    let schema: Schema = Object.getPrototypeOf(this).constructor.schema;

    if (this.__data === undefined) {
      let insert = schema.insert();
      insert.add(this);
      return insert.save();
    }

    return Promise.resolve(1);
  }

  public static find(where: string, param: paramsType): Promise<any[]> {

    let select: Select = this.select();
    select.where(`${ where } = ?`, param);
    return select.all();
  };

  public static select(): Select {

    return this.schema.select();
  }

  public static create(): Create {

    return this.schema.create();
  }

}
