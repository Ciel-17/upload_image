<script setup>
import Uploader from "@/components/Uploader.vue";
import ImageItem from "@/components/ImageItem.vue";
import { ref } from "vue";
import { uploadImage, RequestScheduler } from "@/request";

const allImages = ref([]);
const requestScheduler = new RequestScheduler(3);

const onUploadImage = (images) => {
  const lastIndex = allImages.value.length;
  images.forEach(async (file, index) => {
    allImages.value.push({
      progress: 0,
      filename: file.name,
      thumb: window.URL.createObjectURL(file),
    });

    // 上传接口
    requestScheduler.addRequest(async () => {
      const res = await uploadImage(file, (progressEvent) => {
        let progress = Math.floor(progressEvent.progress * 100);
        allImages.value[lastIndex + index].progress = progress;
      });
      console.log(res);
    });
  });
};
</script>

<template>
  <div class="container">
    <div class="uploader-area">
      <Uploader @upload="onUploadImage" />
    </div>
    <div class="image-list-area">
      <div v-if="allImages.length > 0">
        <ImageItem
          :key="img.thumb"
          v-for="img in allImages"
          :progress="img.progress"
          :thumb="img.thumb"
          :filename="img.filename"
        />
      </div>
      <div class="image-list-empty" v-else>上传列表为空</div>
    </div>
  </div>
</template>

<style scope>
.container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
}
.uploader-area {
  padding: 20px;
  flex: none;
}
.image-list-area {
  flex: auto;
  padding: 20px;
  overflow: auto;
  border-left: 1px solid #eee;
}
.image-list-empty {
  text-align: center;
}
</style>
