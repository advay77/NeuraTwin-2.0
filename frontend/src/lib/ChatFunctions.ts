import api from '../lib/api';

interface Chat {
  prompt: string;
  response: string;
  createdAt?: string;
}

interface SaveChatResponse {
  success: boolean;
  message: string;
}

interface GetRecentChatsResponse {
  success: boolean;
  chats: Chat[];
}

// Save chat to backend
export const saveChatApi = async (
  prompt: string,
  response: string
): Promise<SaveChatResponse> => {
  try {
    const res = await api.post<SaveChatResponse>('/api/chat/save', { prompt, response });
    return res.data;
  } catch (error: any) {
    console.error('Save chat API error:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Failed to save chat');
  }
};

// Get recent chats for AI context
export const getRecentChatsApi = async (): Promise<Chat[]> => {
  try {
    const res = await api.get<GetRecentChatsResponse>('/api/chat/recent');
    return res.data.chats || [];
  } catch (error: any) {
    console.error('Get recent chats API error:', error?.response?.data || error.message);
    return [];
  }
};
