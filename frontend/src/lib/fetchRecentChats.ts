// import axios from "axios";
import api from "./api";

export const fetchRecentChats = async () => {
  try {
    const res = await api.get("/api/chats/recent", {
      withCredentials: true, // includes cookies (JWT token)
    });

    return res.data; // returns array of { prompt, response }
  } catch (err) {
    console.error("Chat history fetch error:", err);
    return [];
  }
};
