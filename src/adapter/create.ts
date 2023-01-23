import { Model } from "../model";

export interface Create<M extends Model>{

  execute() : Promise<void>;
  render() : string;
}