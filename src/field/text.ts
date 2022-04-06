import { Model } from "../model";
import { Adapter, engineKind } from "../adapters/adapter";
import { Field, Config, defaultConfig, codeError } from "./field";

export interface TextConfig extends Config { }

export class Text extends Field {

  readonly config: TextConfig;

  constructor(name: string, config: Partial<TextConfig> = defaultConfig) {

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  public fromDB(value: string|null): string|undefined {

    if (typeof value === 'string') {
      return value;
    }

    return undefined;
  }

  public toDB<T extends Model>(model: T): string|null {

    let name = this.getName();
    let value = model[name as keyof T];

    if(value === undefined){
      return this.getDefaultValue();
    }

    if (typeof value === 'string') {
      return value.trim();
    }

    throw {code: null, message: `value of ${name} to DB is not a string`};
  }

  public castDB(adapter: Adapter): string {

    if (adapter.engine == engineKind.WebSQL) {
      return 'TEXT';
    }

    throw {
      code: codeError.EngineNotImplemented,
      message: `Engine ${ adapter.engine } not implemented on field Text`
    };
  }
}