import { Adapter } from "../adapter/adapter";
import { Model } from "../model";
import { Field, Config, defaultConfig, codeFieldError, FieldKind } from "./field";

export interface JsonConfig extends Config {
  type: 'list' | 'object',
  default?: 'string' | Function | Object;
}

let jsonDefaultConfig: JsonConfig = {
  ...defaultConfig,
  type: 'object',
}

export class JsonField extends Field {

  readonly config: JsonConfig;
  readonly kind: FieldKind = FieldKind.JSON;

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
          code: codeFieldError.DefaultValueIsNotValid,
          message: `Default value on JSON field is not a valid json`
        };
      }
    }

    return valueDefault;
  }

  public fromDB(adapter: Adapter, value: string | null): object | undefined {

    if (value === undefined) {
      return undefined;
    }

    if (value === '') {
      let type = this.config.type;
      if (type === 'object') {
        return {};
      } else {
        return [];
      }
    }

    //return JSON.parse(value);
    return adapter.fieldTransformFromDb<JsonField>(this, value);
  }

  public castDB(adapter: Adapter): string {

    return adapter.fieldCast<JsonField>(this);
  }

  public isJsonObject(): boolean {
    if (this.config.type === 'object') {
      return true;
    }

    return false;
  }

  public toDB(adapter: Adapter, model: Model): string | null {

    let value = super.toDB(adapter, model);

    if (value === null) {
      return null;
    }

    return this.stringifyToDb(value);
  }

  protected stringifyToDb(value: any): string {

    let kind = this.config.type;
    let error = {
      code: codeFieldError.IncorrectValueToDb,
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