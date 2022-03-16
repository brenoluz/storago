import { Schema } from './schema';
import { Select } from './adapters/select';
import { paramsType } from './adapters/query';

interface IData {                                                                                                                               
  [prop: string]: any;                                                      
}  

export class Model {

  public static schema: Schema;
  protected __new: Boolean = true;
  protected __data?: IData;

  [prop: string]: any;

  public async save(): Promise<any> {

    let schema: Schema = Object.getPrototypeOf(this).constructor.schema;

    if(this.__data === undefined){
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

  
  public static createFromDB(row: { [index: string]: any; }): Model {

    let instance = new this;
    for (let a in row) {
      //instance[a] = row[a];
    }

    return instance;
  }
  
}
