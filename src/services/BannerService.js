// src/services/orderService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const API_URL = "https://apioragreen.najeebmart.com";
const xApiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwIiwidGl0bGUiOiJ0b2tlbiBmb3IgYXBpIGtleSIsImlhdCI6MTYzNjQ0ODczOH0.zmvB5qcMd5k_-A2igZjpZppjc-C_PYVb2Saapo38Gi4";
const loadAddresses = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("jwt");
    return jsonValue;
  } catch (e) {
    console.log("Error loading addresses", e);
  }
};
const bannerService = {
  getBanners: async () => {
    const tokenva = await loadAddresses();

    try {
      const response = await axios.get(`${API_URL}/api/v1/app/banners`, {
        headers: {
          "x-api-key": xApiKey,
          Authorization: `Bearer ${tokenva}`,
          "Content-Type": "application/json",
        },
      });

      // Adjust according to the actual API response structure
      return response.data || [];
    } catch (error) {
      console.error(
        "❌ Error fetching user banners:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default bannerService;
