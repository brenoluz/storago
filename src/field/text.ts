import { Connector, engineKind } from "../adapters/connector";
import { Field } from "./field";

export class Text extends Field{

  public fromDB(value: any) : any {

    return value;
  }

  public toDB(value: any) : any {

    return ''.trim();
  }

  public castDB(conn: Connector): string {
    
    if(conn.engine == engineKind.PostgreSQL){
      return 'VARCHAR';

    } if(conn.engine == engineKind.WebSQL){
      return 'text';
    }
  }
}