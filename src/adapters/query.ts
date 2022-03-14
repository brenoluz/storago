import { Model } from '../model';
import { Adapter } from './adapter';

export abstract class Query{

  protected conn: Adapter;
  protected Model: typeof Model;

  constructor(model: typeof Model, conn: Adapter){
  
    this.Model = model;
    this.conn = conn;
  }
}