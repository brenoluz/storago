import { Adapter } from "./adapter/adapter";
import { Schema } from "./schema";
import { Model } from "./model";

export abstract class Scope {

  readonly adapter: Adapter;
  readonly schemas: Schema<Model>[] = [];

  constructor(adapter: Adapter) {

    this.adapter = adapter;
  }

  abstract migrate(): Promise<void>;
}