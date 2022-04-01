import { Adapter, engineKind } from "../adapters/adapter";
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

  public fromDB(value: any) {

    if (!value) {
      return undefined;
    }

    return value;
  }

  public toDB(model: Model): any {

    let name = this.getName();
    let value = model[name];

    if (value == undefined) {
      return null;
    }

    return value;
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