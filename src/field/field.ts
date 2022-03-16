import { Adapter } from "../adapters/adapter";
import { Model } from "../model";

export type config = {
  default?: any;
  required?: boolean;
}

export abstract class Field{

  protected config: config;
  protected name: string;
  protected virtual: boolean = false;

  constructor(name: string, config: config = {}){
    
    this.name = name;
    this.config = config;
  }

  public getName() : string {
    return this.name;
  }

  public isVirtual() : boolean{

    return this.virtual;
  }

  abstract toDB(value: any) : any;
  abstract fromDB(value: any) : any;
  abstract castDB(conn: Adapter) : string;
}
