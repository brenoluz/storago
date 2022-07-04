import { Adapter } from "../adapter/adapter";
import { Model } from "../model";

export enum codeError {
  'EngineNotImplemented' = '@storago/orm/field/engineNotImplemented',
  'DefaultValueIsNotValid' = '@storago/orm/field/defaultParamNotValid',
  'IncorrectValueToDb' = '@storago/orm/field/IncorrectValueToStorageOnDB',
  'RefererNotFound' = '@storago/orm/field/ManyRelationship',
}

export interface Config {
  default?: any;
  required: boolean;
  link?: string;
  index: boolean;
  primary: boolean;
}

export const defaultConfig: Config = {
  required: false,
  index: false,
  primary: false
}

export abstract class Field {

  readonly abstract config: Config;
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public getDefaultValue(): any {

    let valueDefault = this.config.default;

    if (typeof valueDefault === 'function') {
      return valueDefault();
    }
    
    if (valueDefault === undefined) {
      valueDefault = null;
    }

    return valueDefault;
  }

  public isVirtual(): boolean {

    if (this.config.link !== undefined && !this.config.index) {
      return true;
    }

    return false;
  }

  /*
  public async populate(model: Model, row: { [index: string]: any; }): Promise<any> {

    let name = this.getName();
    let value = row[name];

    /*
    if (this.config.link !== undefined) {

      let links: string[] = this.config.link.split('.');
      let itemName = links.shift();

      if (!itemName || itemName in model.__data) {
        model[name] = undefined;
        return;
      }

      value = await model.__data[itemName];

      while (itemName = links.shift()) {

        if (typeof value === 'object') {
          if (itemName in value) {
            value = value[itemName];
          }
        } else {
          break;
        }
      }
    }
    
    return this.fromDB(value);
  }
  */
  
  public toDB<T extends Model>(model: T): any {

    let name = this.getName();
    let value = model[name as keyof T];

    if(value === undefined){
      return this.getDefaultValue();
    }

    return value;
  };
  
  public isJsonObject(): boolean {
    return false;
  }
  
  /*
  protected defineSetter(link: string, schema: Schema, model: Model, value: any) : void {

    if (link) {
      let listName = link.split('.');
      let fieldName = listName[0];
      let target = listName.pop();
      let field = schema.getField(fieldName);
      let item : any = model;
      
      if(field.isJsonObject()){
        let itemName = listName.shift();
        while(itemName){
          
          if(typeof item[itemName] !== 'object'){
            item[itemName] = {};
          }
          
          item = item[itemName];
          itemName = listName.shift();
        }
      }
      
      if(target){
        item[target] = this.parseToDB(value);
      }
    }
  }

  public defineGetter(link: string, schema: Schema, model: Model) : any {

    if (link) {
      let listName = link.split('.');
      let fieldName = listName[0];
      let target = listName.pop();
      let field = schema.getField(fieldName);
      let item : any = model;

      if(field.isJsonObject()){
        let itemName = listName.shift();
        while(itemName){
          
          if(typeof item[itemName] !== 'object'){
            return item[itemName];
          }
          
          item = item[itemName];
          itemName = listName.shift();
        }
      }
      
      if(target){
        return item[target];
      }
    }
  }
  
  
  public defineProperty(schema: Schema, model: Model): void {
    
    
    let link = this.config.link;
    if (link) {
      Object.defineProperty(model, this.name, {
        'set': this.defineSetter.bind(this, link, schema, model),
        'get': this.defineGetter.bind(this, link, schema, model),
      });
    }
  }
  */

  abstract fromDB(value: any): any;
  abstract castDB(adapter: Adapter): string;
}
