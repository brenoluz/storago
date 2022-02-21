import { Adapter } from "./adapters/adapter";
import { Select } from "./adapters/select";
import { Table } from "./table";
import { Field } from "./field/field";
import { session } from './session';

export interface fieldsArray {
  [index: string]: Field;
}

export class Schema{

  private name: string;
  private fields: fieldsArray;
  private conn: Adapter;

  constructor(name: string, fields: fieldsArray, adapter: Adapter = session.adapter){

    this.name = name;
    this.fields = fields;
    this.conn = adapter;
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