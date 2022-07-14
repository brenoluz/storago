import { Adapter } from "../adapter/adapter";
import { Field, Config, defaultConfig, codeError } from "./field";
import { Model } from "../model";
import { v4 as uuid } from 'uuid';

export class UUIDField extends Field {

  readonly config: Config;

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

  public toDB<T extends Model>(adapter: Adapter, model: T): string | null {

    let value = super.toDB(adapter, model);
    return value;
  }
}