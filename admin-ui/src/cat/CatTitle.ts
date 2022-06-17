import { Cat as TCat } from "../api/cat/Cat";

export const CAT_TITLE_FIELD = "name";

export const CatTitle = (record: TCat): string => {
  return record.name || record.id;
};
