import { paramsType } from "./query";

export interface Insert{

  from(from: string, columns?: string[]) : Insert;
  execute() : Promise<any>;
  render() : string;
}
