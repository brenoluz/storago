import { Adapter } from "../adapters/adapter";

export type config = {
  default?: any;
  required?: boolean;
}

export abstract class Field{

  _config: config;

  constructor(config?: config){
    this._config = config;
  }

  public getName(name: string) : string {
    return name;
  }

  abstract toDB(value: any) : any;
  abstract fromDB(value: any) : any;
  abstract castDB(conn: Adapter) : string;
}
