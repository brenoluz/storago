//I am doing a ORM multi database support, and a have this context, this code works
//but on the method select of schema is return instanceof Select<M>, but I would like 
// to return SqliteSelect<M>
//lib orm 
class Model {
  id?: number;
}

interface Adapter {

  getSelect<M extends Model>(schema: Schema<this, M>): Select<M>;
}

abstract class Select<M extends Model>{

  getAll(): M[] {
    return []
  }
}

abstract class Schema<A extends Adapter, M extends Model>{

  abstract Model: new () => M;
  abstract modelName: string;
  readonly adapter: A;

  constructor(adapter: A) {
    this.adapter = adapter;
  }

  newModel(): M {
    return new this.Model();
  }

  select(): Select<M> {
    return this.adapter.getSelect<M>(this);
  }
}

///adapter for sqlite
class SqliteSelect<M extends Model> extends Select<M>{
}

class SqliteAdapter implements Adapter {

  protected db?: Database;

  getSelect<M extends Model>(schema: Schema<this, M>): SqliteSelect<M> {
    return new SqliteSelect<M>();
  }
}

//app place

class MonkeyModel extends Model{}

class MonkeySchema<A extends Adapter> extends Schema<A, MonkeyModel>{

  Model: new () => MonkeyModel = MonkeyModel;
  modelName: string = 'monkeys'
}

let ZooAdapter = new SqliteAdapter();
let schemaMonkey = new MonkeySchema<SqliteAdapter>(ZooAdapter);

let select = schemaMonkey.select();
//type of select = Select<MonkeyModel>, but I would like the return to be SqliteSelect<MonkeyModel>

