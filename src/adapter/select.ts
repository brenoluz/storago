import { Model } from "../model";
import { paramsType } from "./query";

export interface Select<M extends Model> {

  from(from: string, columns?: string[]): Select<M>;
  execute(): Promise<any>;
  where(criteria: string, params?: paramsType[] | paramsType): Select<M>;
  all(): Promise<M[]>;
  one(): Promise<M | undefined>;
  render(): string;
}