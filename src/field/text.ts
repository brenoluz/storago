import { Model } from "../model";
import { Adapter, engineKind } from "../adapters/adapter";
import { Field } from "./field";

export class Text extends Field{

  public fromDB(value: any) : any {

    if(typeof value === 'string'){
      return value;
    }

    if('toString' in value){
      return value.toString();
    }

    return undefined;
  }

  public toDB(model: Model) : any {

    let name = this.getName();
    let value = model[name];

    if(typeof value === 'string'){
      return value.trim();
    }

    if('toString' in value){
      return value.toString();
    }

    return null;
  }

  public castDB(conn: Adapter): string {
    
    if(conn.engine == engineKind.PostgreSQL){
      return 'VARCHAR';
    }

    return 'TEXT';
  }
}