<script setup>
const props = defineProps({
  filename: String,
  thumb: String,
  progress: Number,
});
</script>
<template>
  <div
    class="image-item"
    :style="{
      backgroundImage: `linear-gradient(to right ,#9fcef6 ${progress}% ,white ${progress}%)`,
    }"
  >
    <div
      class="image-thumb"
      :style="{ backgroundImage: `url(${thumb})` }"
    ></div>
    <div class="image-info">
      <div>{{ filename }}</div>
      <div>{{ progress }}%</div>
    </div>
  </div>
</template>
<style scoped>
.image-item {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s;
}
.image-item:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}
.image-thumb {
  flex: none;
  width: 60px;
  height: 60px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.image-info {
  display: flex;
  flex: auto;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
}
</style>
