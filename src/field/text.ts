import { Adapter, engineKind } from "../adapters/adapter";
import { Field } from "./field";

export class Text extends Field{

  public fromDB(value: any) : any {

    return value;
  }

  public toDB(value: any) : any {

    return ''.trim();
  }

  public castDB(conn: Adapter): string {
    
    if(conn.engine == engineKind.PostgreSQL){
      return 'VARCHAR';

    }

    return 'TEXT';
  }
}