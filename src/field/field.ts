import { Connector } from "../adapters/connector";

export type config = {
  default?: any;
  required?: boolean;
}

export abstract class Field{

  _config: config;

  constructor(config?: object){
    this._config = config;
  }

  abstract toDB(value: any) : any;
  abstract fromDB(value: any) : any;
  abstract castDB(conn: Connector) : string;
}
