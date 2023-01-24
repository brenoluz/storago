import { Adapter } from "./adapter/adapter";
import { Select } from "./adapter/select";
import { Insert } from "./adapter/insert";
import { Drop } from "./adapter/drop";
import { paramsType } from "./adapter/query";
import { Model } from "./model";
import { Field } from "./field/field";
import { Create } from "./adapter/create";
import { UUIDField } from "./field/uuid";

export enum codeSchemaError {
  'PostSaveNotFound' = '@storago/orm/schema/PostSaveNotFound',
}

export abstract class Schema<A extends Adapter, M extends Model> {

  //abstract readonly Model: ModelConstructor<M>;
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
      console.log('save update', model.__data);
      throw 'Method update do not implemented';

    } else {

      console.log('save insert', model.__data);
      let insert = this.insert();
      insert.add(model);
      await insert.save();
    }

    return model;
  }

  /*
  public getModelClass(): ModelConstructor<M> | undefined {

    return this.Model;
  }
  */

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

    throw { code: null, message: `Field with name: ${name} not exists in ${this.name}` };
  }

  public getColumns(): string[] {

    let columns: string[] = [];
    let fields = this.getFields();
    for (let field of fields) {
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

  public drop(): Drop<M> {
    return this.adapter.drop<M>(this);
  }

  public async populateFromDB(row: { [index: string]: any; }): Promise<M> {

    let data: { [key: string]: any } = {};

    let fields = this.getFields();

    for (let field of fields) {
      let name = field.getName();
      if (name == 'id') {
        continue;
      }

      data[name] = field.fromDB(this.adapter, row[name]);
    }

    return this.createFromInterface(data);
  }

  abstract createFromInterface(data: Object): M;
}