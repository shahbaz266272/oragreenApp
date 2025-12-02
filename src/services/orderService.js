// src/services/orderService.ts
import axios from "axios";

export const API_URL = "http://localhost:8985";
const xApiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwIiwidGl0bGUiOiJ0b2tlbiBmb3IgYXBpIGtleSIsImlhdCI6MTYzNjQ0ODczOH0.zmvB5qcMd5k_-A2igZjpZppjc-C_PYVb2Saapo38Gi4";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJlZ2lzdGVyZWRBdCI6IjIwMjUtMTEtMTFUMDc6MTM6MTUuODI4WiIsImlzQWN0aXZlIjp0cnVlLCJyb2xlIjoidXNlciIsIl9pZCI6IjY5MTJlNTZlODliMjRhM2M4MTkzMDQyYiIsIm1vYmlsZSI6IjkyMzM1MzYzNjkyMSIsImNyZWF0ZWRBdCI6IjIwMjUtMTEtMTFUMDc6Mjc6NDIuMjI4WiIsInVwZGF0ZWRBdCI6IjIwMjUtMTItMDJUMTg6MTk6NDguNjc3WiIsIl9fdiI6MCwicGhvbmVPdHAiOiIiLCJkZXZpY2VUb2tlbiI6IjY4ZjM3NTc0ZTQ4Njk2OWNjZDgxMDliMSIsImxhc3RMb2dpbiI6MTc2NDY5OTU4ODY3NX0sImlhdCI6MTc2NDY5OTU4OCwiZXhwIjoxNzY3MjkxNTg4fQ.x0itCsxUeJm8n0TQ7RsCj82DbfJKUqMzdbrYbSKmBps";
const orderService = {
  getUserOrders: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/app/user/orders/6912e56e89b24a3c8193042b`,
        {
          headers: {
            "x-api-key": xApiKey,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Adjust according to the actual API response structure
      return response.data || [];
    } catch (error) {
      console.error(
        "❌ Error fetching user orders:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default orderService;
