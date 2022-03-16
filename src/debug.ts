interface Debug{
  select: boolean,
  insert: boolean,
  create: boolean,
}

export let debug: Debug = {
  select: true,
  insert: true,
  create: true,
}