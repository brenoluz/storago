import { ModelInterface } from "../model";

export interface Insert<M extends ModelInterface>{

  render() : string;
  execute() : Promise<any>;
  add(row: M): void;
  save(): Promise<void>;
  getValues() : any[];
}
