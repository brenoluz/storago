import { Schema } from './schema';
import { Select, paramsType } from './adapters/select';

export class Table{

  public static schema: Schema;
  [key: string]: any;

  public static find(where: string, param: paramsType) : Promise<any[]> {
    
    let select: Select = this.select();
    select.where(`${where} = ?`, param);
    return select.all();
  };

  public static select() : Select{

    return this.schema.select(this);
  }

  public static createFromDB(row: {[index: string]: any;}) : Table {

    let instance = new this;
    for(let a in row){
      instance[a] = row[a];
    }

    return instance;
  }
}
