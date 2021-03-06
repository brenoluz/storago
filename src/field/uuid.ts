import { Adapter } from "../adapter/adapter";
import { Field, Config, defaultConfig, FieldKind } from "./field";
import { Model } from "../model";
import { v4 as uuid } from 'uuid';

export class UUIDField extends Field {

  readonly config: Config;
  readonly kind: FieldKind = FieldKind.UUID;

  constructor(name: string, config: Partial<Config> = defaultConfig) {

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    };
  }

  public castDB(adapter: Adapter): string {

    return adapter.fieldCast<UUIDField>(this);
  }

  public fromDB(value: any): string | undefined {

    if (value === null) {
      return undefined;
    }

    if (typeof value === 'string') {
      return value;
    }

    throw { code: null, message: 'value from DB is not a valid uuid' };
  }

  public getDefaultValue(): any {

    let value = super.getDefaultValue();

    if (value === null && this.config.primary) {
      value = uuid();
    }

    return value;
  }

  public toDB<A extends Adapter, M extends Model>(adapter: A, model: M): any {

    let value = super.toDB<A, M>(adapter, model);
    return adapter.fieldTransformToDB<UUIDField, M>(this, value);
  }
}