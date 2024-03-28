import { requestClient } from "./requestClient";

export const uploadImage = (img, onUploadProgress) => {
  const formData = new FormData();
  formData.append("image", img);
  return requestClient.post("/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

export const getImgs = (params) => {
  return requestClient.get("/images/search", {
    params,
  });
};
