import { Schema } from './schema';
import { Select } from './adapters/select';
import { paramsType } from './adapters/query';

export class Model {

  public static schema: Schema;
  protected __new: Boolean = true;
  protected __data?: object;
  [key: string]: any;

  public static insert() : any{

    let query = this.schema.insert()
  }

  public async save(): Promise<any> {

    let schema: Schema = Object.getPrototypeOf(this).constructor.schema;

    if(this._data == undefined){
      let insert = schema.insert();
      insert.add(this);

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

  public static createFromDB(row: { [index: string]: any; }): Model {

    let instance = new this;
    for (let a in row) {
      instance[a] = row[a];
    }

    return instance;
  }
}
