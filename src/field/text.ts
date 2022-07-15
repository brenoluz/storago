import { Model } from "../model";
import { Adapter } from "../adapter/adapter";
import { Field, Config, defaultConfig, FieldKind } from "./field";

export interface TextConfig extends Config { }

export class TextField extends Field {

  readonly config: TextConfig;
  readonly kind: FieldKind = FieldKind.TEXT;

  constructor(name: string, config: Partial<TextConfig> = defaultConfig) {

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  public fromDB(adapter: Adapter, value: string|null): string|undefined {

    if (typeof value === 'string') {
      return value;
    }

    return undefined;
  }

  public toDB<T extends Model>(adapter: Adapter, model: T): string|null {

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

    return adapter.fieldCast<TextField>(this);
  }
}