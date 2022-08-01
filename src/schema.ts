import { Adapter } from "./adapter/adapter";
import { Select } from "./adapter/select";
import { Insert } from "./adapter/insert";
import { paramsType } from "./adapter/query";
import { Model, ConstructorModel } from "./model";
import { Field } from "./field/field";
import { Create } from "./adapter/create";
import { UUIDField } from "./field/uuid";
import { v4 as uuid } from 'uuid';

export enum codeSchemaError {
  'PostSaveNotFound' = '@storago/orm/schema/PostSaveNotFound',
}

export abstract class Schema<A extends Adapter, M extends Model> {

  abstract readonly Model: ConstructorModel<M>;
  abstract readonly name: string;
  
  readonly fields: Field[] = [];

  readonly adapter: A;

  protected superFields: Field[] = [
    new UUIDField('id', { primary: true }),
  ];

  constructor(adapter: A) {

    this.adapter = adapter;
  }

  public async save(model: M): Promise<M> {

    if (model.__data) {
      //update area
    } else {

      let insert = this.insert();
      insert.add(model);
      await insert.save();
    }

    return this.refreshModel(model);
  }

  public async refreshModel(model: M): Promise<M> {

    let id = model['id'];

    let item = await this.find('id = ?', id);
    if (item === undefined) {
      throw { code: codeSchemaError.PostSaveNotFound, message: `Fail to find id: ${ id }` };
    }

    return this.populateFromDB(item, model);
  }

  public getModelClass(): ConstructorModel<M> {

    return this.Model;
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
    let fields = this.getFields();
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

  public getAdapter(): A {
    return this.adapter;
  }

  public select(): Select<M> {
    let select = this.adapter.select<M>(this);
    select.from(this.getName(), this.getColumns());
    return select;
  }

  public insert(): Insert<M> {
    let insert = this.adapter.insert<M>(this);
    return insert;
  }

  public createTable(): Create<M> {
    return this.adapter.create<M>(this);
  }

  public newModel(): M {

    return new this.Model(uuid());
  }

  public async populateFromDB(row: { [index: string]: any; }, model?: M): Promise<M> {

    if (model == undefined) {
      model = this.newModel();
    }

    let fields = this.getFields();
    model.__data = row;
    for (let field of fields) {
      let name = field.getName();
      if (name == 'id') {
        continue;
      }
      model[name as keyof M] = field.fromDB(this.adapter, row[name]);
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