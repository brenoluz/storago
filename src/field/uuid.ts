import { Adapter, engineKind } from "../adapters/adapter";
import { Field, Config, defaultConfig, codeError } from "./field";
import { Model } from "../model";
import { v4 as uuid } from 'uuid';

export class UUID extends Field {

  readonly config: Config;

  constructor(name: string, config: Partial<Config> = defaultConfig){

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    };
  }

  public castDB(adapter: Adapter): string {

    if(adapter.engine == engineKind.WebSQL){
      return 'TEXT';
    }

    throw {code: codeError.EngineNotImplemented, 
      message: `Engine ${adapter.engine} not implemented on Field UUID`};
  }

  public fromDB(value: any) {
    
    return value;
  }

  public getDefaultValue() : any {
    
    let value = super.getDefaultValue();

    if(value === undefined && this.config.primary){
      value = uuid();
    }

    return value;
  }

  public toDB(model: Model) : any {

    let value = super.toDB(model);
    return value;
  }
}