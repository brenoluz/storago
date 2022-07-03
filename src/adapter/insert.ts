import { Model } from "../model";

export interface Insert{

  render() : string;
  execute() : Promise<any>;
  add(row: Model): void;
  save(): Promise<void>;
}
