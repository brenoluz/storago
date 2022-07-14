export { Field, FieldKind } from "./field";

import { TextField } from "./text";
import { UUIDField } from "./uuid";
import { JsonField } from "./json";
import { ManyField } from "./many";
import { IntegerField } from "./integer";
import { BooleanField } from "./boolean";
import { DateTimeField } from "./datetime";

export const fields = {
  TextField,
  UUIDField,
  JsonField,
  ManyField,
  IntegerField,
  BooleanField,
  DateTimeField,
}
