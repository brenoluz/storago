import { Adapter } from "./adapters/adapter";
import { Select } from "./adapters/select";
import { Insert } from "./adapters/insert";
import { paramsType } from "./adapters/query";
import { Model } from "./model";
import { Field } from "./field/field";
import { session } from './session';
import { Create } from "./adapters/create";
import { UUID } from "./field/uuid";

export class Schema<M extends Model> {

  protected name: string;
  protected adapter: Adapter;
  protected Model: new () => M;
  protected fields: Field[] = [];

  protected superFields: Field[] = [
    new UUID('id', { primary: true }),
  ];

  constructor(model: new () => M, name: string, fields: Field[] = [], adapter: Adapter = session.adapter) {

    this.name = name;
    this.adapter = adapter;
    this.Model = model;
    this.fields = this.fields.concat(fields);
  }

  public async saveRow(model: Model): Promise<void> {

    if (model.__data) {
      //update area
    }

    let insert = this.insert();
    insert.add(model);
    return insert.save();
  }

  public getModelClass(): (new () => M) {

    return this.Model;
  }

  public create(): Create {

    return this.adapter.create<M>(this.Model, this);
  }

  public getName(): string {
    return this.name;
  }

  public getFields(): Field[] {

    return [...this.superFields, ...this.fields];
  }

  public getField(name: string): Field {

    for (let field of this.getFields()) {
      if (name == field.getName()) {
        return field;
      }
    }

    throw { code: null, message: `Field with name: ${ name } not exists in ${ this.name }` };
  }

  public getColumns(): string[] {

    let columns: string[] = [];
    for (let field of this.getFields()) {
      columns.push(field.getName());
    }

    return columns;
  }

  public find(where: string, param: paramsType): Promise<M | undefined> {

    let select = this.select();
    select.where(where, param);
    return select.one();
  };

  public getAdapter(): Adapter {
    return this.adapter;
  }

  public select(): Select<M> {
    let select = this.adapter.select<M>(this.Model, this);
    select.from(this.getName(), this.getColumns());
    return select;
  }

  public insert(): Insert {
    let insert: Insert = this.adapter.insert<M>(this.Model, this);
    return insert;
  }

  public async populateFromDB(row: { [index: string]: any; }): Promise<M> {

    let fields = this.getFields();
    let model = new this.Model();
    model.__data = row;
    for (let field of fields) {
      let name = field.getName();
      model[name as keyof M] = field.fromDB(row[name]);
    }

    return model;
  }

  /*
  public async populateFromDB<T extends Model>(row: { [index: string]: any; }, model: T): Promise<T> {

    let promises: Promise<any>[] = [];
    let fields = this.getRealFields();
    let keys: string[] = [];
  
    for (let field of fields) {
      let name = field.getName();
      let promisePopulate = field.populate(model, row);
      model.__data[name] = promisePopulate;
      promises.push(promisePopulate);
      keys.push(name);
    }

    let data = await Promise.all(promises);
    for(let k in keys){
      let name = keys[k];
      model[name as keyof T] = data[k];
    }

    return model;
  }

  public defineProperties(model: Model) : void {

    for(let field of this.getFields()){
      field.defineProperty(this, model);
    }
  } 
  */
}