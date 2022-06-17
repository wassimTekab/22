<template>
  <el-row>
    <el-col :xs="24" :md="12" class="mx-auto mb-4">
      <el-card :body-style="{ padding: '0px' }">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in 4" :key="item">
            <img
              src="https://www.cieau.com/wp-content/uploads/2019/11/eau_nature.jpg"
              class="image"
            />
          </el-carousel-item>
        </el-carousel>

        <div style="padding: 14px">
          <el-row :gutter="20">
            <el-col :span="6">
              <p class="item__key" v-for="item in Object.keys(detail)">
                {{ item }}:
              </p>
            </el-col>
            <el-col :span="6">
              <p class v-for="item in Object.values(detail)">{{ item }}</p>
            </el-col>
          </el-row>

          <div class="bottom">
            <el-button text class="button" @click="() => $router.go(-1)">{{
              $t("detail.back")
            }}</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";

export default defineComponent({
  name: "user-detail",
  components: {},
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs("users", ["detail"]);
    });
    const detail = {};

    return {
      detail,
    };
  },
});
</script>

<style>
.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
.item__key {
  font-weight: bold;
}
</style>
