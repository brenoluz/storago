import { Adapter } from "../adapters/adapter";
import { Model } from "../model";

export enum codeError {
  'EngineNotImplemented' ='@storago/orm/field/engineNotImplemented',
  'DefaultValueIsNotValid' = '@storago/orm/field/defaultParamNotValid',
  'IncorrectValueToDb' = '@storago/orm/field/IncorrectValueToStorageOnDB',
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
  protected name: string;

  constructor(name: string){
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public getDefaultValue(): any {

    let valueDefault = this.config.default;

    if (valueDefault === undefined) {
      return undefined;
    }

    if (typeof valueDefault === 'function') {
      return valueDefault();
    }

    return valueDefault;
  }

  public isVirtual(): boolean {

    if (this.config.link !== undefined && !this.config.index) {
      return true;
    }

    return false;
  }

  public async populate(model: Model, row: { [index: string]: any; }): Promise<any> {

    let name = this.getName();
    let value = row[name];

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

  public toDB(model: Model): any {

    let name = this.getName();
    let value = model[name];

    if (value === undefined) {
      value = this.getDefaultValue();
    }

    if (value === undefined) {
      value = null;
    }

    return value;
  };

  abstract fromDB(value: any): any;
  abstract castDB(adapter: Adapter): string;
}
