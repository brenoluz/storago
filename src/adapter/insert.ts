import { Model } from "../model";
import { Adapter } from "./adapter";

export interface Insert<A extends Adapter, M extends Model>{

  render() : string;
  execute() : Promise<any>;
  add(row: M): void;
  save(): Promise<void>;
}
