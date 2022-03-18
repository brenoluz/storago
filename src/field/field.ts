import { Adapter } from "../adapters/adapter";
import { Model } from "../model";

export type config = {
  default?: any;
  required?: boolean;
  link?: string;
  index?: boolean;
}

export abstract class Field{

  protected config: config;
  protected name: string;

  constructor(name: string, config: config = {}){
    
    this.name = name;
    this.config = config;
  }

  public getName() : string {
    return this.name;
  }

  public isVirtual() : boolean{

    if(this.config.link !== undefined && !this.config.index){
      return true;
    }

    return false;
  }

  public async popule(model: Model, row: { [index: string]: any; }) : Promise<any> {

    let name = this.getName();
    let value = row[name];

    if(this.config.link !== undefined){
      
      let links : string[] = this.config.link.split('.');
      let itemName = links.shift();

      if(!itemName  || itemName  in model.__data){
        model[name] = undefined;
        return;
      }

      value = await model.__data[itemName];

      while(itemName = links.shift()){

        if(typeof value === 'object'){
          if(itemName in value){
            value = value[itemName];
          }
        }else{
          break;
        }
      }
    }

    return this.fromDB(value);
  }

  abstract toDB(model: Model) : any;
  abstract fromDB(value: any) : any;
  abstract castDB(adapter: Adapter) : string;
}
