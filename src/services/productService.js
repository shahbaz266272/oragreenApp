// src/services/productService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const API_URL = "https://apioragreen.najeebmart.com";
// "https://orsgreenserver.vercel.app/api/v1/manager/product";
const loadAddresses = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("jwt");
    return jsonValue;
  } catch (e) {
    console.log("Error loading addresses", e);
  }
};
const xApiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwIiwidGl0bGUiOiJ0b2tlbiBmb3IgYXBpIGtleSIsImlhdCI6MTYzNjQ0ODczOH0.zmvB5qcMd5k_-A2igZjpZppjc-C_PYVb2Saapo38Gi4";

const productService = {
  getProducts: async (
    managerId,
    page = 0,
    size = 100,
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJlZ2lzdGVyZWRBdCI6IjIwMjUtMTAtMThUMTE6MDk6MjYuNjA5WiIsImlzQWN0aXZlIjp0cnVlLCJyb2xlIjoibWFuYWdlciIsIl9pZCI6IjY4ZjM3NTc0ZTQ4Njk2OWNjZDgxMDliMSIsImZ1bGxOYW1lIjoiT3JhZ3JlZW4iLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJwYXNzd29yZCI6IiQyYSQxMCRqY0NlWVBIdFM4dHY1eGRsS1R3OFZ1UktEalNlNEFkLjJBeEhrQUZRNlR2WjlDSVVqLmtxSyIsInN0b3JlIjp7Im5hbWUiOiJPcmFncmVlbiBQbGFudCIsIm1vYmlsZSI6Iis5MjMwMDEyMzQ1NjciLCJlbWFpbCI6ImpvaG5AZG9lLmNvbSIsImludHJvIjoiIiwiYWJvdXQiOiIiLCJhdmF0YXIiOnsiX2lkIjoiNjkxMzI3ZTU2MDM5NGE3MjMxMTMyODNlIiwiZmllbGRuYW1lIjoiZmlsZSIsIm9yaWdpbmFsbmFtZSI6Im9yYWdyZWVubG9nby5wbmciLCJlbmNvZGluZyI6IjdiaXQiLCJtaW1ldHlwZSI6ImltYWdlL3BuZyIsImRlc3RpbmF0aW9uIjoiLi91cGxvYWRzL2FkbWluIiwiZmlsZW5hbWUiOiJvcmFncmVlbmxvZ29fMTc2Mjg2MzA3NzA5My5wbmciLCJwYXRoIjoidXBsb2Fkcy9hZG1pbi9vcmFncmVlbmxvZ29fMTc2Mjg2MzA3NzA5My5wbmciLCJzaXplIjoyMTk2OH0sImFkZHJlc3MiOnsibGluZSI6Ik9yYWdyZWVuIFBsYW50IiwiY2l0eSI6IklzbGFtYWJhZCIsImNvdW50cnkiOiJQYWtpc3RhbiIsImxvY2F0aW9uIjp7InR5cGUiOiJQb2ludCIsImNvb3JkaW5hdGVzIjpbMzMuNjk1MSw3Mi45NzI0XX19fSwiY3JlYXRlZEF0IjoiMjAyNS0xMC0xOFQxMTowOTo0MC43NTBaIiwidXBkYXRlZEF0IjoiMjAyNS0xMS0yM1QxMzo0NTo1Mi40MzRaIiwiX192IjowLCJsYXN0TG9naW4iOjE3NjM5MDU1NTI0Mjd9LCJpYXQiOjE3NjM5MDU1NTIsImV4cCI6MTc2NjQ5NzU1Mn0.ghgziCmQ60DwHfd94Ba3msaOmWdTn8t0Swars7ymTp8"
  ) => {
    const tokenva = await loadAddresses();

    try {
      const response = await axios.get(
        `${API_URL}/api/v1//app/products?page=${page}&size=${size}`,
        {
          headers: {
            "x-api-key": xApiKey,

            Authorization: `Bearer ${tokenva}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data?.data?.docs || [];
    } catch (error) {
      console.error(
        "❌ Error fetching products:",
        error.response?.data || error
      );
      throw error;
    }
  },
};

export default productService;
