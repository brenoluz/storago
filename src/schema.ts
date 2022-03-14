import { Adapter } from "./adapters/adapter";
import { Select } from "./adapters/select";
import { Insert } from "./adapters/insert";
import { Model } from "./model";
import { Field } from "./field/field";
import { session } from './session';

export class Schema{

  private name: string;
  private fields: Field[];
  private conn: Adapter;

  constructor(name: string, fields: Field[], adapter: Adapter = session.adapter){

    this.name = name;
    this.fields = fields;
    this.conn = adapter;
  }

  public getName() : string {
    return this.name;
  }

  public getFields() : Field[] {
    return this.fields;
  }

  public getColumns() : string[] {

    let columns: string[] = [];
    for(let field of this.fields){

      if(!field.isVirtual()){
        columns.push(field.getName());
      }
    }

    return columns;
  }

  public getAdapter() : Adapter {
    return this.conn;
  }

  public select(model: typeof Model) : Select {
    let select: Select = this.conn.select(model);
    select.from(this.name, this.getColumns());
    return select;
  }

  public insert(model: typeof Model) : Insert{

    let insert: Insert = this.conn.insert(model);
    insert.from(this.name, this.getColumns());
    return insert;
  }
}