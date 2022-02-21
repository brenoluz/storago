import { Adapter } from './adapters/adapter';
import { WebSQLAdapter } from './adapters/websql/adapter';

interface Defaults {
  adapter: Adapter;
}

export const session: Defaults = {
  adapter: new WebSQLAdapter('default', 'default db', 1024**2),
};

export function setDefaultAdapter(adapter: Adapter){
  session.adapter = adapter;
}
