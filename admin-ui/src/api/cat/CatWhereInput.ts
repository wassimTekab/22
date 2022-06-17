import { StringFilter } from "../../util/StringFilter";
import { FloatFilter } from "../../util/FloatFilter";

export type CatWhereInput = {
  id?: StringFilter;
  name?: StringFilter;
  color?: StringFilter;
  weight?: FloatFilter;
};
