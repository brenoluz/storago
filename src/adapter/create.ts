import { Model } from "../model";
import { Adapter } from "./adapter";

export interface Create<A extends Adapter, M extends Model<A>>{

  execute(tx: any) : Promise<any>;
  render() : string;
}