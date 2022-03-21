import { Adapter } from "../adapters/adapter";
import { Field } from "./field";
import { Model } from "../model";
import { v4 as uuidv4 } from 'uuid';

export class UUID extends Field {

  public castDB(adapter: Adapter): string {

    return 'TEXT';
  }

  public fromDB(value: any) {
    
    return value;
  }

  public getDefaultValue() : any {
    
    let value = super.getDefaultValue();

    if(value === undefined && this.config.primary){
      value = uuidv4();
    }

    return value;
  }

  public toDB(model: Model) : any {

    let value = super.toDB(model);

    return value;
  }
}