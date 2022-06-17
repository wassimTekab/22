<template>
  <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
    <el-form-item label="name" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="color" prop="color">
      <el-input v-model="form.color" />
    </el-form-item>
    <el-form-item label="weight" prop="weight">
      <el-input-number :min="0" :max="100000" v-model="form.weight" />
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button @click="resetForm(ruleFormRef)">Cancel</el-button>
      <el-button type="primary" @click="onSubmit(ruleFormRef)"
        >Create</el-button
      >
    </div>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCatStore } from "@/store/useCatModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
export default defineComponent({
  props: {
    isEdit: { type: Boolean, default: false },
  },
setup(props) {
  const { cat, error } = storeToRefs(useCatStore());
  const { getCatById, createCat, editCat } = useCatStore();
  const route = useRoute();
  const router = useRouter();
  const initialState = [object Object]
  const form = reactive({"name":"","color":"","weight":0});
  const ruleFormRef = ref<InstanceType<typeof ElForm>>();
    const rules = reactive({"name":[{"required":true,"message":`${t('entityForm.validation.required')}`,"trigger":"blur"}],"color":[{"required":true,"message":`${t('entityForm.validation.required')}`,"trigger":"blur"}],"weight":[{"required":true,"message":`${t('entityForm.validation.required')}`,"trigger":"blur"}]});

      const handleSubmitForm = async () => {
        if (props.isEdit) {
          const id = route?.params?.id as string;
          return await editCat({ data: form, id });
        } else await createCat(form);
      };

      const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
        if (!formEl) return;
        formEl.validate(async (valid) => {
          if (valid) {
            await handleSubmitForm();
            if (!!error.value) {
              Components.ElMessage.error(error.value?.message);
              console.log(error,"error");
            } else router.push({ name: "list-cat" });
          } else {
            console.log("error submit!");
            return false;
          }
        });
      };
      const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
        if (!formEl) return;
        Object.assign(form, initialState);
        formEl.resetFields();
      };
      const getCurrentCat = async (id: string) => {
        if (props.isEdit) {
          await getCatById(id);
        }
      };
      onMounted(async () => {
        const id = route.params.id as string;
        await getCurrentCat(id);
        if (!!cat.value) {
          ["name","color","weight"].forEach(item => {
            form[item] = cat.value[item]
          })
        }
      });
    return {
        onSubmit,
        form,
        resetForm,
        rules,
        ruleFormRef,
    }
},
});
</script>
