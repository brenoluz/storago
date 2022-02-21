import { Adapter } from "./adapters/adapter";
import { Select } from "./adapters/select";
import { Table } from "./table";
import { Field } from "./field/field";

export interface fieldsArray {
  [index: string]: Field;
}

export class Schema{

  private name: string;
  private fields: fieldsArray;
  private conn: Adapter;

  constructor(name: string, fields: fieldsArray, Adapter?: Adapter){

    this.name = name;
    this.fields = fields;

    if(!!Adapter){
      this.conn = Adapter;
    }
  }

  public getName() : string {
    return this.name;
  }

  public getFields() : fieldsArray {
    return this.fields;
  }

  public getAdapter() : Adapter {
    return this.conn;
  }

  public select(table: typeof Table) : Select {
    let select: Select = this.conn.select(table);
    select.from(this.name, Object.keys(this.fields));
    return select;
  }
}