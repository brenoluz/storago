import { Adapter } from "./adapters/adapter";
import { Select } from "./adapters/select";
import { Insert } from "./adapters/insert";
import { Model } from "./model";
import { Field } from "./field/field";
import { session } from './session';
import { Create } from "./adapters/create";

export class Schema{

  private name: string;
  private fields: Field[];
  private adapter: Adapter;
  protected Model: typeof Model;

  constructor(model: typeof Model, name: string, fields: Field[], adapter: Adapter = session.adapter){

    this.name = name;
    this.fields = fields;
    this.adapter = adapter;
    this.Model = model;
  }

  public create() : Create{

    return this.adapter.create(this.Model);
  }

  public getName() : string {
    return this.name;
  }

  public getFields() : Field[] {
    return this.fields;
  }

  public getRealFields() : Field[]{

    let fieldFiltred: Field[] = [];
    for(let field of this.fields){

      if(!field.isVirtual()){
        fieldFiltred.push(field);
      }
    }

    return fieldFiltred;
  }

  public getColumns() : string[] {

    let columns: string[] = [];
    for(let field of this.fields){

      if(!field.isVirtual()){
        columns.push(field.getName());
      }
    }

    return columns;
  }

  public getAdapter() : Adapter {
    return this.adapter;
  }

  public select() : Select {
    let select: Select = this.adapter.select(this.Model);
    return select;
  }

  public insert() : Insert{

    let insert: Insert = this.adapter.insert(this.Model);    
    return insert;
  }
}