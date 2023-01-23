import { Model } from "../model";

export interface Drop<M extends Model>{

  render() : string;
  execute() : Promise<any>;
}
