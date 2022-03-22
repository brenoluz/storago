import { Adapter, engineKind } from "../adapters/adapter";
import { Model } from "../model";
import { Field, Config, defaultConfig, codeError } from "./field";

export interface JsonConfig extends Config {
  type: 'list' | 'object',
  default?: 'string' | Function | Object;
}

let jsonDefaultConfig: JsonConfig = {
  ...defaultConfig,
  type: 'object',
}

export class Json extends Field {

  readonly config: JsonConfig;

  constructor(name: string, config: Partial<JsonConfig> = jsonDefaultConfig) {

    super(name);
    this.config = {
      ...jsonDefaultConfig,
      ...config,
    };
  }

  public getDefaultValue(): any {

    let valueDefault = super.getDefaultValue();

    if (typeof valueDefault === 'string') {
      try {
        valueDefault = JSON.parse(valueDefault);
      } catch (e) {
        throw {
          code: codeError.DefaultValueIsNotValid,
          message: `Default value on JSON field is not a valid json`
        };
      }
    }

    return valueDefault;
  }

  public fromDB(value: any) {

    if (value === undefined || value === '') {
      let kind = this.config.type;
      if (kind === 'object') {
        return {};
      } else {
        return [];
      }
    }
  }

  public castDB(adapter: Adapter): string {

    if (adapter.engine == engineKind.WebSQL) {
      return 'TEXT';
    }

    throw {
      code: codeError.EngineNotImplemented,
      message: `Engine ${ adapter.engine } not implemented on Field Json`
    };
  }

  public toDB(model: Model) : string|null {

    let value = super.toDB(model);

    if(value === null){
      return null;
    }

    return this.stringifyToDb(value);
  }

  protected stringifyToDb(value: any): string {

    let kind = this.config.type;
    let error = {
      code: codeError.IncorrectValueToDb,
      message: `value is not a valid json`,
    };

    /* Test if value is valid */
    if (typeof value === 'string') {
      try {
        JSON.parse(value); //just test
        if (Array.isArray(value)) {
          if (kind !== 'list') {
            error.message = 'JSON is a object, but must be a list';
            throw error;
          }
        } else {
          if (kind !== 'object') {
            error.message = 'JSON is a list, but must be a object';
            throw error;
          }
        }

        return value;

      } catch (e) {
        throw error;
      }
    }

    /* convert to string */
    if (typeof value === 'object') {
      try {
        value = JSON.stringify(value);
      } catch (e) {
        throw error;
      }
    }

    return value;
  }
}