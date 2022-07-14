import { Adapter } from "../adapter/adapter";
import { Model } from "../model";
import { Field, Config, defaultConfig, FieldKind } from "./field";

export interface IntegerConfig extends Config { }

export class IntegerField extends Field {

  readonly config: IntegerConfig;
  readonly kind: FieldKind = FieldKind.Integer;

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

  public toDB<T extends Model>(adapter: Adapter, model: T): number|null {

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

    return adapter.fieldCast<IntegerField>(this);
  }
}