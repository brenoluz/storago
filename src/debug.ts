interface Debug{
  select: boolean,
  insert: boolean,
  create: boolean,
  drop: boolean,
  query: boolean,
}

export let debug: Debug = {
  select: false,
  insert: false,
  create: false,
  drop: false,
  query: false,
}