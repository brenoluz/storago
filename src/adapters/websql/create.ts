import { Create } from "../create";
import { fieldsArray } from "../../schema";

export class CreateWebSQL extends Create{
 
  private parse() : any {

    let fields: fieldsArray = this.Table.schema.getFields();
    
  }

  execute(): Promise<any> {
    return Promise.resolve();
  }
}