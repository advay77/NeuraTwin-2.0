'use client';
import OtpForm from '@/components/OtpForm';
import { emailSchema } from '@/schemas/LoginSchema';
import { EmailSchemaType } from '@/types/LoginSchemaType';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Orb from '../../components/ui/Orb';
import { loginAction, verifyOtpAction } from './actions';

const page = () => {
  const router = useRouter();
  const [otpPage, setOtpPage] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(emailSchema),
  });
  const onSubmit = async (data: EmailSchemaType) => {
    try {
      const res = await loginAction(data.email);
      if (res.success) {
        toast.success(res.message);
        setOtpPage(true);
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const res = await verifyOtpAction(otp);

      if (res.success) {
        const toastId = toast.success('OTP Verified!');
        localStorage.setItem('auth-token', res.token);

        setTimeout(() => {
          toast.dismiss(toastId); // Dismiss the first toast
          toast.loading('Redirecting...');

          if (res.newUser) {
            router.push('/profile-update');
          } else {
            router.push('/home');
          }
        }, 2000);
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Verification failed');
    }
  };

  return (
    <section className='bg-gradient-to-b from-black  to-[#7B68DA] w-full h-screen overflow-hidden relative py-3'>
      <div className='w-full h-[350px] relative z-0'>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      <Link
        href='/'
        passHref
      >
        <h2
          className={`font-sora font-semibold tracking-tight text-white text-[38px] absolute top-40 left-1/2 -translate-x-1/2 z-50 cursor-pointer`}
        >
          <span className='bg-gradient-to-b from-white via-gray-400 to-indigo-600 text-transparent bg-clip-text [-webkit-background-clip:text]'>
            Neura
          </span>
          Twin
        </h2>
      </Link>
      {/* EMAIL FORM \\ OTP FORM */}

      {!otpPage ? (
        <div className='mt-6 min-[600px]:px-8 px-4 max-w-4xl mx-auto'>
          <h3 className=' font-orbitron min-[1000px]:text-4xl min-[600px]:text-3xl text-2xl text-balance font-medium text-white tracking-tight text-center'>
            Unlock Your Full Potential
          </h3>
          <p className='text-gray-400 min-[800px]:text-2xl text-xl font-medium tracking-tight text-balance mt-5 text-center font-sora'>
            Enter your email and we will send you Magic code! Remember to do not
            share code with anyone.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full max-w-md mx-auto mt-20'
          >
            <div>
              <input
                type='email'
                placeholder='Enter Email...'
                {...register('email')}
                className='w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
              />
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full mt-10 px-4 py-2 font-sora font-bold bg-gradient-to-l from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center gap-3 hover:scale-105 transition-all duration-200 cursor-pointer text-white disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <>
                  Sending
                  <Loader
                    size={20}
                    className='animate-spin text-white'
                  />
                </>
              ) : (
                <>
                  Get The Code
                  <ArrowUpRight
                    size={22}
                    className='text-white'
                  />
                </>
              )}
            </button>

            {errors.email && (
              <p className='text-[15px] text-gray-400 mt-2 font-inter font-light animate-bounce transition-all duration-1000 text-center'>
                {errors.email.message}
              </p>
            )}
          </form>
        </div>
      ) : (
        // OTP FORM
        <OtpForm onVerify={handleVerifyOtp} />
      )}
    </section>
  );
};

export default page;
