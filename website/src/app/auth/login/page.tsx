'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn, useSession } from 'next-auth/react';
import { LoginApiData } from '@/types/api.types';
import ErrorForm from '@/components/error-form/error-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginApiData>({
    defaultValues: {
      email: 'ruan@gmail.com',
      password: '123456'
    }
  });

  const router = useRouter()
  async function loginForm(inputs: LoginApiData) {
    const response = await signIn('credentials', {redirect: false, ...inputs})
    console.log('what i received', response);
    
    if (response?.status === 200) {
      toast.success("Logged and redirecting . . .");
      setTimeout(() => {
        router.push('/library')
      }, 2000)
      return;
    }
    toast.error(response?.error || 'Something goes wrong!');
  }

  function goHome() {
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative w-full flex justify-center pt-[15vh] flex-1 p-5" style={{backgroundColor: '#7c24d9', background: 'linear-gradient(90deg, #3a1561, #140033)'}}>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-gray-200 flex fill-gray-300 justify-center items-center gap-2 cursor-pointer hover:text-blue-200 hover:fill-blue-200" onClick={goHome}>
              <svg stroke="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" d="M24 24H0V0h24v24z"></path>
                <circle cx="9" cy="12" r="8"></circle>
                <path d="M17 4.26v2.09a5.99 5.99 0 0 1 0 11.3v2.09c3.45-.89 6-4.01 6-7.74s-2.55-6.85-6-7.74z"></path>
              </svg>
              Ion Recording
            </h2>
            <h2 className="mt-1 text-3xl font-extrabold text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Or{' '}
              <Link
                href="/auth/register"
                className="font-medium text-blue-300 hover:text-blue-500"
              >
                create a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(loginForm)}>
            <div className="space-y-4 rounded-md">
              <div>
                <Label htmlFor="email-address" className='text-gray-200 '>Email address</Label>
                <Input
                  {...register('email', {required: true})}
                  type="email"
                  autoComplete="email"
                  className="mt-1 bg-gray-900 border-gray-950 text-purple-400 h-12 hover:bg-gray-950"
                  placeholder="Enter your email"
                />
                <ErrorForm errors={errors} nameField="email" />
              </div>
              <div>
                <Label htmlFor="password" className='text-gray-200'>Password</Label>
                <Input
                  {...register('password', {required: true})}
                  type="password"
                  autoComplete="current-password"
                  className="mt-1 bg-gray-900 border-gray-950 text-purple-400 h-12 hover:bg-gray-950"
                  placeholder="Enter your password"
                />
                <ErrorForm errors={errors} nameField="password" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-100"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-gray-100"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full h-12" style={{backgroundColor: '#7c24d9', background: 'linear-gradient(90deg, #7c24d9, #4a03b8)'}}>
                SIGN IN
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-puple-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-purple-200 rounded-lg px-2 text-purple-600">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full h-12 hover:bg-purple-300 border-purple-500">
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                Sign in with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
