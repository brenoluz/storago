import { paramsType } from "./query";

export interface Select{

  from(from: string, columns?: string[]) : Select;
  execute() : Promise<any>;
  where(criteria: string, params?: paramsType[] | paramsType) : Select;
  all() : Promise<any[]>;
  render() : string;
}