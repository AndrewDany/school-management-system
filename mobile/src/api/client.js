import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANT: Replace this with your computer's local network IP
// (not "localhost" — a phone can't reach your computer's localhost).
// Find it with `ipconfig` on Windows (look for IPv4 Address), e.g. 192.168.1.42.
// Your phone and computer must be on the same Wi-Fi network.
const API_BASE_URL = "http://192.168.1.42:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("sms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
