import { Adapter, engineKind } from "../adapter/adapter";
import { Model } from "../model";
import { Field, codeError, Config, defaultConfig } from "./field";

export interface IntegerConfig extends Config { }

export class IntegerField extends Field {

  readonly config: IntegerConfig;

  constructor(name: string, config: Partial<IntegerConfig> = defaultConfig){

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  public fromDB(value: any): number|undefined {

    if (!value) {
      return undefined;
    }

    if(typeof value === 'number'){
      return value;
    }

    throw {code: null, message: 'value from DB is not a number'};
  }

  public toDB<T extends Model>(model: T): number|null {

    let name = this.getName();
    let value = model[name as keyof T];
    
    if (value == undefined) {
      return this.getDefaultValue();
    }

    if(typeof value === 'number'){
      return Math.floor(value);
    }

    throw {code: null, message: `value of ${name} to DB is not a integer`};
  }

  public castDB(adapter: Adapter): string {

    if (adapter.engine === engineKind.WebSQL) {
      return 'INTEGER';
    }

    throw {
      code: codeError.EngineNotImplemented,
      message: `Engine ${ adapter.engine } not implemented on field Integer`
    };
  }
}