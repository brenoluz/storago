export interface ModelInterface {
  id: string,
  __data?: ModelInterface,
}

type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];


export type ModelConstructor<M extends ModelInterface> = new (data: M) => M;