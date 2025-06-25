'use server';

import api from '@/lib/api';
import { cookies } from 'next/headers';

export const completeProfileAction = async (data: any) => {
  const cookieStore = await cookies();
  const res = await api.post('/api/auth/complete-profile', data);

  let authToken = res.headers['auth-token'] || '';
  if (authToken) {
    cookieStore.set({
      name: 'auth-token',
      value: authToken,
    });
  }

  if (res.data.success) {
    return {
      success: true,
      token: authToken,
    };
  } else {
    return { success: false };
  }
};
