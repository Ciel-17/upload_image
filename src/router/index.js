import { createRouter, createWebHistory } from "vue-router";

const UploadImage = () => import("../views/UploadImage.vue");
const Waterfall = () => import("../views/Waterfall.vue");
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "uploadImage",
      component: UploadImage,
    },
    {
      path: "/waterfall",
      name: "waterfall",
      component: Waterfall,
    },
  ],
});

export default router;
