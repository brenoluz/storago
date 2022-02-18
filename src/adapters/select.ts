
export type Rowset = any[];

export default interface Select{

  execute() : Promise<Rowset>;
  render() : string;
}