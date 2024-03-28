<script setup>
import { onMounted, ref } from "vue";
import { getImgs } from "@/request";

const cardList = ref([]);
const pagination = {
  page: 1,
  size: 20,
};
const columnHeights = Array.from({ length: 4 }, () => 0);
const WIDTH = 400;
const allImgs = ref([]);

const getMinCol = () => {
  const minHeight = Math.min(...columnHeights);
  const index = columnHeights.findIndex((v) => v === minHeight);
  return {
    index,
    height: minHeight,
  };
};

let isEnd = false;
const loadImgs = async () => {
  const res = await getImgs(pagination);
  // console.log(res);
  const links = res.data;
  if (links.length < pagination.size) {
    isEnd = true;
  }
  links.forEach((link) => {
    const image = new Image();
    image.src = link;
    image.className = "img";
    image.onload = () => {
      // 最下值高度
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

const getOffsetTop = (el) => {
  let offsetTop = 0;
  while (el) {
    offsetTop += el.offsetTop;
    el = el.offsetParent;
  }
  return offsetTop;
};

let isLoading = false;
const onScroll = async () => {
  // scrollTop 滚动距离，clientHeight 屏幕高度
  const { scrollTop, clientHeight } = document.documentElement;
  const lastEl = cardList.value.lastChild;
  // console.log(lastEl.offsetTop, 1);
  // console.log(getOffsetTop(lastEl), 2);
  if (!isLoading) {
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
