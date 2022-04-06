import { Model } from "..";
import { Adapter, engineKind } from "../adapters/adapter";
import { Config, defaultConfig, Field, codeError } from "./field";

export interface DateTimeConfig extends Config { }

export class DateTimeField extends Field {

  readonly config: DateTimeConfig;

  constructor(name: string, config: Partial<DateTimeConfig> = defaultConfig) {

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  public fromDB(value: number|null): Date|undefined{

    if(value === null){
      return undefined;
    }

    return new Date(value);
  }

  public toDB<T extends Model>(model: T) : number {
    
    let name = this.getName();
    let value = model[name as keyof T];

    if(value === undefined){
      return this.getDefaultValue();
    }

    if(value instanceof Date){
      return value.getTime();
    }

    throw {code: null, message: `value of ${name} to DB is not a Date`};
  }

  public castDB(adapter: Adapter): string {
    
    if(adapter.engine == engineKind.WebSQL){
      return 'NUMBER';
    }

    throw {
      code: codeError.EngineNotImplemented,
      message: `Engine ${ adapter.engine } not implemented on field Text`
    };
  }
}