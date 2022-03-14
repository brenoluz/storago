import { Adapter } from "../adapters/adapter";

export type config = {
  default?: any;
  required?: boolean;
}

export abstract class Field{

  protected config: config;
  protected name: string;

  constructor(name: string, config: config = {}){
    
    this.name = name;
    this.config = config;
  }

  public getName() : string {
    return this.name;
  }

  abstract toDB(value: any) : any;
  abstract fromDB(value: any) : any;
  abstract castDB(conn: Adapter) : string;
}
