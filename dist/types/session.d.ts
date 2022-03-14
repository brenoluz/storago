import { Adapter } from './adapters/adapter';
interface Defaults {
    adapter: Adapter;
}
export declare const session: Defaults;
export declare function setDefaultAdapter(adapter: Adapter): void;
export {};
