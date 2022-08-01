import { Model } from "..";
import { Adapter } from "../adapter/adapter";
import { Config, defaultConfig, Field, FieldKind } from "./field";

export interface BooleanConfig extends Config { }

export class BooleanField extends Field {

  readonly config: BooleanConfig;
  readonly kind: FieldKind = FieldKind.BOOLEAN;

  constructor(name: string, config: Partial<BooleanConfig> = defaultConfig) {

    super(name);
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  public fromDB<A extends Adapter>(adapter: A, value: string): boolean | undefined {

    return adapter.fieldTransformFromDb(this, value);
  }

  public toDB<A extends Adapter, M extends Model>(adapter: A, model: M): any {

    let value = super.toDB<A, M>(adapter, model);
    return adapter.fieldTransformToDB<BooleanField, M>(this, value);
  }

  public castDB<A extends Adapter>(adapter: A): string {

    return adapter.fieldCast<BooleanField>(this);
  }
}