import { Connector } from "./adapters/connector";
import { Select } from "./adapters/select";
import { Table } from "./table";
import { Field } from "./field/field";

export interface fieldsArray {
  [index: string]: Field;
}

export class Schema{

  private name: string;
  private fields: fieldsArray;
  private conn: Connector;

  constructor(name: string, fields: fieldsArray, connector?: Connector){

    this.name = name;
    this.fields = fields;

    if(!!connector){
      this.conn = connector;
    }
  }

  public getName() : string {
    return this.name;
  }

  public getFields() : fieldsArray {
    return this.fields;
  }

  public getConnector() : Connector {
    return this.conn;
  }

  public select(table: typeof Table) : Select {
    let select: Select = this.conn.select(table);
    select.from(this.name, Object.keys(this.fields));
    return select;
  }
}