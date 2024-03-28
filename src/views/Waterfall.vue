<script setup>
import { onMounted, ref } from "vue";
import { getImgs } from "@/request";

// 瀑布流容器
const cardList = ref([]);
const pagination = {
  page: 1,
  size: 20,
};
// 瀑布流为四列，记录每一列的高度，初始值：[0, 0, 0, 0]
const columnHeights = Array.from({ length: 4 }, () => 0);
// 每一列宽度
const WIDTH = 400;
const allImgs = ref([]);

// 获取高度最小的一列，以便后续插入图片
const getMinCol = () => {
  const minHeight = Math.min(...columnHeights);
  const index = columnHeights.findIndex((v) => v === minHeight);
  return {
    index,
    height: minHeight,
  };
};
// 表示是否请求结束
let isEnd = false;
// 加载图片方法
const loadImgs = async () => {
  const res = await getImgs(pagination);
  // console.log(res);
  // 包含图片路径的列表 link[]
  const links = res.data;
  // 请求到的链接数量小于请求数量，则请求结束
  if (links.length < pagination.size) {
    isEnd = true;
  }
  links.forEach((link) => {
    const image = new Image();
    image.src = link;
    image.className = "img";
    image.onload = () => {
      // 最小高度
      const minCol = getMinCol();
      // console.log(minCol.index * WIDTH, minCol.height);
      // 创建DOM
      const cardBox = document.createElement("div");
      cardBox.className = "card-box";
      cardBox.style.left = `${minCol.index * WIDTH}px`;
      cardBox.style.top = `${minCol.height}px`;
      const card = document.createElement("div");
      card.className = "card";

      card.appendChild(image);
      cardBox.appendChild(card);

      cardList.value.appendChild(cardBox);
      // 更新列的高度
      columnHeights[minCol.index] += cardBox.offsetHeight;
    };
  });
};

// 获取元素到页面顶部的距离
const getOffsetTop = (el) => {
  let offsetTop = 0;
  while (el) {
    offsetTop += el.offsetTop;
    el = el.offsetParent;
  }
  return offsetTop;
};
// 是否处于加载中,如果是,则不进行请求的发送
let isLoading = false;
const onScroll = async () => {
  // scrollTop 滚动距离，clientHeight 屏幕高度
  const { scrollTop, clientHeight } = document.documentElement;
  const lastEl = cardList.value.lastChild;
  // console.log(lastEl.offsetTop, 1);
  // console.log(getOffsetTop(lastEl), 2);
  if (!isLoading) {
    // 如果滚动距离加到屏幕高度大于最后一个元素的高度的一半，并且没有请求结束
    if (
      scrollTop + clientHeight >
        lastEl.offsetHeight / 2 + getOffsetTop(lastEl) &&
      !isEnd
    ) {
      pagination.page++;
      isLoading = true;

      await loadImgs();
      isLoading = false;
    }
  }
};

onMounted(() => {
  // 监听滚动事件
  window.addEventListener("scroll", onScroll);
  loadImgs();
});
</script>

<template>
  <div class="cards" ref="cardList">
    <div v-for="(img, index) in allImgs" class="card-box" :key="index">
      <div class="card">
        <img :src="img" alt="" class="img" />
      </div>
    </div>
  </div>
</template>
<style>
.cards {
  margin: 10px auto;
  width: 1600px;
  position: relative;
}
.card-box {
  position: absolute;
  padding: 10px;
}
.card {
  box-sizing: border-box;
  width: 380px;
  padding: 10px;
  border: 5px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}
.img {
  width: 100%;
}
</style>
