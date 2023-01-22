import { ModelInterface } from "../model";

export interface Create<M extends ModelInterface>{

  execute() : Promise<void>;
  render() : string;
}