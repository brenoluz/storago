

export interface Select{

  from(from: string, columns?: any[]) : Select;
  execute() : Promise<any>;
  all() : Promise<any[]>;
  render() : string;
}