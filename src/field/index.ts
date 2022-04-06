import { Text } from "./text";
import { UUID } from "./uuid";
import { Json } from "./json";
import { Many } from "./many";
import { Field } from "./field";
import { IntegerField } from "./integer";
import { BooleanField } from "./boolean";
import { DateTimeField } from "./datetime";

export const fields = {
  Field: Field,
  Text: Text,
  UUID: UUID,
  Json: Json,
  Many: Many,
  Integer: IntegerField,
  Boolean: BooleanField,
  DateTime: DateTimeField,
}
