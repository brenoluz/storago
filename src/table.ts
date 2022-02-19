import Schema from './schema';
import {Select} from './adapters/select';

export class Table{

  public foo: string;
  public static schema: Schema;
  [key: string]: any;

  public static find(where: string, param: string | number) : any[] {
    
    
    return [];
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