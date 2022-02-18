import Table from './table';
import Schema from './schema';
import Adapter from './adapter';

export default function(table: ClassDecorator, schema?: Schema, adapter?: Adapter) : Table{

  if(!!schema){
    schema = table.
  }

  return table;
}