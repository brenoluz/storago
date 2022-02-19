import { Connector } from "./adapters/connector";
import { Select } from "./adapters/select";
import { Table } from "./table";

export default class{

  name: string;
  fields: object;
  connector: Connector;

  constructor(name: string, fields: object, connector?: Connector){

    this.name = name;
    this.fields = fields;

    if(!!connector){
      this.connector = connector;
    }
  }

  public getConnector() : Connector {
    return this.connector;
  }

  public select(table: typeof Table) : Select {
    let select: Select = this.connector.select(table);
    select.from(this.name, Object.keys(this.fields));
    return select;
  }
}