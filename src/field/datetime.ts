import { Model } from "..";
import { Adapter } from "../adapter/adapter";
import { Config, defaultConfig, Field, FieldKind } from "./field";

export interface DateTimeConfig extends Config { }

export class DateTimeField extends Field {

  readonly config: DateTimeConfig;
  readonly kind: FieldKind = FieldKind.DATETIME;

  constructor(name: string, config: Partial<DateTimeConfig> = defaultConfig) {

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  public fromDB<A extends Adapter>(adapter: A, value: any) : Date|undefined {

    if(value === null){
      return undefined;
    }

    return new Date(value);
  }

  public toDB<A extends Adapter, M extends Model>(adapter: A, model: M) : number {
    
    let name = this.getName();
    let value = model[name as keyof M];

    if(value === undefined){
      return this.getDefaultValue();
    }

    if(value instanceof Date){
      return value.getTime();
    }

    throw {code: null, message: `value of ${name} to DB is not a Date`};
  }

  public castDB<A extends Adapter>(adapter: A): string {
    
    return adapter.fieldCast<DateTimeField>(this);
  }
}