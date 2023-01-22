import { ModelInterface } from "../model";

export interface Drop<M extends ModelInterface>{

  render() : string;
  execute() : Promise<any>;
}
