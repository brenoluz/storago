import { Adapter } from "../adapter/adapter";
import { Model } from "../model";
import { Field, Config, defaultConfig, FieldKind } from "./field";

export interface IntegerConfig extends Config { }

export class IntegerField extends Field {

  readonly config: IntegerConfig;
  readonly kind: FieldKind = FieldKind.INTEGER;

  constructor(name: string, config: Partial<IntegerConfig> = defaultConfig) {

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  public fromDB<A extends Adapter>(adapter: A, value: string): number | undefined {

    if (!value) {
      return undefined;
    }

    if (typeof value === 'number') {
      return value;
    }

    throw { code: null, message: 'value from DB is not a number' };
  }

  public toDB<A extends Adapter, M extends Model<A>>(adapter: A, model: M): any {

    let name = this.getName();
    let value = model[name as keyof M];

    if (value == undefined) {
      return this.getDefaultValue();
    }

    if (typeof value === 'number') {
      return Math.floor(value);
    }

    throw { code: null, message: `value of ${ name } to DB is not a integer` };
  }

  public castDB<A extends Adapter>(adapter: A): string {

    return adapter.fieldCast<IntegerField>(this);
  }
}