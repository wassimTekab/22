<template>
  <Teleport to="body">
    <el-dialog
      v-model="isOpenModal"
      :title="title"
      width="30%"
      :show-close="false"
    >
      <slot></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$emit('close-confirm-modal')">Cancel</el-button>
          <el-button type="primary" @click="$emit('approve-confirm-modal')"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const props = defineProps({
  isOpenModal: Boolean,
  title: String,
});
defineEmits(["close-confirm-modal", "approve-confirm-modal"]);
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
