interface Populate {
  [name: string]: Promise<any>;
}

export class Model{

  public id?: string;
  public __data: Populate = {};
}
