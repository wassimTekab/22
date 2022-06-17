<template>
  <div class="col-12 col-md-8 mx-auto mt-4 border border-secondary p-5 card">
    <h3 class="text-center text-primary my-4">Create Cat</h3>
    <CatForm :isEdit="false" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CatForm from "@/components/forms/CatForm.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";
import { onMounted } from "vue";
export default defineComponent({
  name: "create-cat",
  components: {
    CatForm,
  },
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs("create cat", ["cats"]);
    });
    return {};
  },
});
</script>
