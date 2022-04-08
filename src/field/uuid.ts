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

  public fromDB(value: any) : string|undefined {

    if(value === null){
      return undefined;
    }

    if(typeof value === 'string'){
      return value;
    }
    
    throw {code: null, message: 'value from DB is not a valid uuid'};
  }

  public getDefaultValue() : any {
    
    let value = super.getDefaultValue();

    if(value === null && this.config.primary){
      value = uuid();
    }

    return value;
  }

  public toDB<T extends Model>(model: T) : string|null {

    let value = super.toDB(model);
    return value;
  }
}