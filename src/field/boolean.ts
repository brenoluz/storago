import { Model } from "..";
import { Adapter, engineKind } from "../adapters/adapter";
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

  public fromDB(value: string) : boolean|undefined {
    
    if(value === null){
      return undefined;
    }

    if(value === 'true'){
      return true;
    }else{
      return false;
    }
  }

  public toDB<T extends Model>(model: T) {
    
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
    
    if(adapter.engine == engineKind.WebSQL){
      return 'BOOLEAN';
    }

    throw {
      code: codeError.EngineNotImplemented,
      message: `Engine ${ adapter.engine } not implemented on field Text`
    };
  }
}