<script setup>
import { onMounted, ref } from "vue";
import { isImageFile } from "@/utils";
const controller = ref();
const emiter = defineEmits();

onMounted(() => {
  if (controller.value) {
    controller.value.addEventListener(
      "change",
      (e) => {
        // 判断上传的是否是image类型的文件
        const files = Array.from(e.target.files).filter((file) =>
          isImageFile(file)
        );

        // 清空input
        controller.value.value = "";
        // 将上传的图片向上传递
        emiter("upload", files);
      },
      false
    );
  }
});
</script>

<template>
  <div class="uploader-container">
    <input
      type="file"
      class="uploader-controller"
      multiple
      accept="image/png,image/jpeg"
      ref="controller"
    />
    <div class="uploader-text">上传图片</div>
  </div>
</template>

<style scoped>
.uploader-container {
  position: relative;
  width: 100px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s;
  border-radius: 4px;
}
.uploader-container:hover {
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
}
.uploader-controller {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.uploader-text {
  text-align: center;
  height: 30px;
  line-height: 30px;
}
</style>
