export interface Create{

  execute(tx: any) : Promise<any>;
  render() : string;
}