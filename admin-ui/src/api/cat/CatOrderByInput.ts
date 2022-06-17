import { SortOrder } from "../../util/SortOrder";

export type CatOrderByInput = {
  id?: SortOrder;
  createdAt?: SortOrder;
  updatedAt?: SortOrder;
  name?: SortOrder;
  color?: SortOrder;
  weight?: SortOrder;
};
