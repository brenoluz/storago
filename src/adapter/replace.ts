import { Model } from "../model";

export interface Replace<M extends Model>{

  render() : string;
  execute() : Promise<any>;
  add(row: M): void;
  save(): Promise<void>;
  getValues() : any[];
}
