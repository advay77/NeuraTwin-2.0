'use server';

import api from '@/lib/api';
import { cookies } from 'next/headers';

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
  if (res.headers['set-cookie']) {
    const cookies = res.headers['set-cookie'];
    cookies.forEach((cookie: string) => {
      cookieStore.set({
        name: cookie.split(';')[0].split('=')[0],
        value: cookie.split(';')[0].split('=')[1],
      });
    });
  }

  if (res.data.success) {
    return {
      success: true,
      newUser: res.data.newUser,
      message: 'Login success',
    };
  } else {
    return { success: false, message: 'Invalid or expired OTP' };
  }
};
