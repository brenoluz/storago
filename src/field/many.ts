import { Model } from "../model";
import { UUIDField } from "./uuid";
import { codeError, Config, defaultConfig } from "./field";
import { Schema } from "..";

export class ManyField extends UUIDField{

  readonly config: Config;
  protected referer: typeof Model;

  constructor(name: string, referer: typeof Model, config?: Partial<Config>){

    super(`${name}_id`);
    this.referer = referer;
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  /*
  public defineProperty(schema: Schema, model: Model): void {
    
    let column = this.getName();
    let name = column.replace('_id', '');
    let proxy = this;
    model[name] = async function(item?: typeof this.referer|string) : Promise<Model|void|undefined>{
      
      if(item == undefined){
        let idReferer = model[column]; 
        return proxy.referer.find('id = ?', idReferer);
      }

      if(item instanceof proxy.referer){
        model[column] = item.id;
        return Promise.resolve();
      }

      let ref = await proxy.referer.find('id = ?', item);
      if(ref === undefined){
        throw {code: codeError.RefererNotFound, message: `Not found ${item} on table ${name}`};
      }
      model[column] = ref.id;
      return Promise.resolve();
    }
  }
  */
}