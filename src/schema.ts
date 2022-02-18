

export default class{

  name: string;
  fields: object;
  db: Database;

  constructor(name: string, fields: object, db?: Database){

    this.name = name;
    this.fields = fields;

    if(!!db){
      this.db = db;
    }
  }

  public select() : Select{


  }
}