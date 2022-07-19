import { Model } from "../model";
import { paramsType } from "./query";
import { Adapter } from "./adapter";

export interface Select<A extends Adapter, M extends Model>{

  from(from: string, columns?: string[]) : Select<A, M>;
  execute() : Promise<any>;
  where(criteria: string, params?: paramsType[] | paramsType) : Select<A, M>;
  all() : Promise<M[]>;
  one() : Promise<M|undefined>;
  render() : string;
}