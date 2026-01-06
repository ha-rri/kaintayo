const Config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  USE_MOCK_DATA: process.env.EXPO_PUBLIC_USE_MOCK_DATA === "true",
};

export default Config;
