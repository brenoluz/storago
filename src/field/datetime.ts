import { Model } from "..";
import { Adapter } from "../adapter/adapter";
import { Config, defaultConfig, Field, FieldKind } from "./field";

export interface DateTimeConfig extends Config { }

export class DateTimeField extends Field {

  readonly config: DateTimeConfig;
  readonly kind: FieldKind = FieldKind.DateTime;

  constructor(name: string, config: Partial<DateTimeConfig> = defaultConfig) {

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  public fromDB(adapter: Adapter, value: number|null): Date|undefined{

    if(value === null){
      return undefined;
    }

    return new Date(value);
  }

  public toDB<T extends Model>(adapter: Adapter, model: T) : number {
    
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
    
    return adapter.fieldCast<DateTimeField>(this);
  }
}