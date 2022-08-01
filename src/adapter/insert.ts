import { Model } from "../model";
import { Adapter } from "./adapter";

export interface Insert<M extends Model>{

  render() : string;
  execute() : Promise<any>;
  add(row: M): void;
  save(): Promise<void>;
  getValues() : any[];
}
