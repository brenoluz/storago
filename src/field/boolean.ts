import { Model } from "..";
import { Adapter } from "../adapter/adapter";
import { Config, defaultConfig, Field, codeError } from "./field";

export interface BooleanConfig extends Config { }

export class BooleanField extends Field {

  readonly config: BooleanConfig;

  constructor(name: string, config: Partial<BooleanConfig> = defaultConfig){

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  public fromDB(adapter: Adapter, value: string) : boolean|undefined {
    
    if(value === null){
      return undefined;
    }

    if(value === 'true'){
      return true;
    }else{
      return false;
    }
  }

  public toDB<T extends Model>(adapter: Adapter, model: T) {
    
    let name = this.getName();
    let value = model[name as keyof T];

    if(value === undefined){
      return this.getDefaultValue();
    }

    if(typeof value === 'boolean'){
      if(value === true){
        return 'true';
      }

      return false;
    }

    throw {code: null, message: `value of ${name} to DB is not a boolean`};
  }

  public castDB(adapter: Adapter): string {
    
    return adapter.fieldCast<BooleanField>(this);
  }
}