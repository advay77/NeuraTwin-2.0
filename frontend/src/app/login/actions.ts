'use server';

import api from '@/lib/api';
import { log } from 'console';
import { cookies, headers } from 'next/headers';

export const loginAction = async (email: string) => {
  const cookieStore = await cookies();

  const res = await api.post('/api/auth/login', { email });
  if (res.data.success) {
    cookieStore.set({
      name: 'temp_email',
      value: email,
    });

    return { success: true, message: 'OTP sent to your mail!' };
  } else {
    return { success: false, message: 'Something went wrong!' };
  }
};

export const verifyOtpAction = async (otp: string) => {
  const cookieStore = await cookies();
  const email = cookieStore.get('temp_email')?.value;

  if (!email) {
    return { success: false, message: 'Email not found in cookies' };
  }

  const res = await api.post('/api/auth/verify-otp', { email, otp });
  let authToken = res.headers['auth-token'] || '';
  if (authToken) {
    cookieStore.set({
      name: 'auth-token',
      value: authToken,
    });
  }

  if (res.data.success) {
    cookieStore.delete('temp_email');
    return {
      success: true,
      newUser: res.data.newUser,
      message: 'Login success',
      token: authToken,
    };
  } else {
    return { success: false, message: 'Invalid or expired OTP' };
  }
};

export const logoutAction = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  try {
    const res = await api.post(
      '/api/user/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      // Clear the auth token cookie
      // cookieStore.delete('auth-token');
      cookieStore.getAll().forEach((cookie) => {
        cookieStore.delete(cookie.name);
      });
    }
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    log('Error during logout:', error);
    return { success: false, message: 'Logout failed' };
  }
};
