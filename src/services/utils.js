import { API_URL } from "./productService";

export const getImageUrl = (path) => {
  return `${API_URL}/${path}`;
};
