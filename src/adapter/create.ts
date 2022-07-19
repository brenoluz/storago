import { Model } from "../model";
import { Adapter } from "./adapter";

export interface Create<A extends Adapter, M extends Model>{

  execute() : Promise<any[] | undefined>;
  render() : string;
}