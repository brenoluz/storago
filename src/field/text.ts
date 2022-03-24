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

  public fromDB(value: any): any {

    if (typeof value === 'string') {
      return value;
    }

    return undefined;
  }

  public toDB(model: Model): any {

    let name = this.getName();
    let value = model[name];

    if (typeof value === 'string') {
      return value.trim();
    }

    if ('toString' in value) {
      return value.toString();
    }

    return null;
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