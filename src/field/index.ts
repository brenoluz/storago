export { Field } from "./field";

import { Text } from "./text";
import { UUID } from "./uuid";
import { Json } from "./json";
import { Many } from "./many";
import { IntegerField } from "./integer";
import { BooleanField } from "./boolean";
import { DateTimeField } from "./datetime";

export const fields = {
  Text: Text,
  UUID: UUID,
  Json: Json,
  Many: Many,
  Integer: IntegerField,
  Boolean: BooleanField,
  DateTime: DateTimeField,
}
