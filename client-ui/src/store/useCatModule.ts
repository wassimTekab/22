import { CatUpdateInput, CatCreateInput, Cat } from "./../../index";
import { defineStore } from "pinia";
import service from "@/service";
interface IPagination {
  take: number;
  skip: number;
}
export const useCatStore = defineStore("cat-store", {
  state: () => {
    return {
      catList: [] as Array<Cat>,
      isLoading: false,
      error: null as Object | any,
      cat: null as Cat | null,
      pagination: {
        skip: 0,
        take: 3,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchCats(payload: IPagination) {
      this.isLoading = true;
      try {
        const { data } = await service.api.catControllerFindMany({
          skip: payload.skip,
          take: payload.take,
        });
        this.catList = data.paginatedResult;
        this.pagination.total = data.totalCount;
        this.pagination = {
          ...this.pagination,
          skip: payload.skip,
          take: payload.take,
        };
        this.error = null;
      } catch (err: any) {
        this.catList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteCat(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.catControllerDelete(payload);
        this.catList = this.catList.filter((cat) => cat.id !== data.id);
        this.pagination.total--;
        this.isLoading = false;
        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async editCat(payload: { data: CatUpdateInput; id: string }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.catControllerUpdate(
          payload.id,
          payload.data
        );
        this.catList = this.catList.map((item) =>
          item.id === payload.id ? { ...item, ...data } : item
        );
        this.error = null;
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async getCatById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.catControllerFindOne(payload);
        this.cat = data;
        this.error = null;
      } catch (err: any) {
        this.cat = null;
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createCat(payload: CatCreateInput) {
      this.isLoading = true;
      try {
        const { data } = await service.api.catControllerCreate(payload);
        this.catList = [...this.catList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
