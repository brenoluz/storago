import { Model } from "../model";
import { Adapter } from "./adapter";

export interface Create<M extends Model>{

  execute() : Promise<void>;
  render() : string;
}