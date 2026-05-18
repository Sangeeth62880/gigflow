import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { loginSchema, LoginInput } from '@/utils/validators';

export function LoginPage() {
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setApiError('');
      const response = await authApi.login(data);
      if (response.success) {
        login(response.data.user, response.data.token);
        navigate('/');
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            GigFlow
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 shadow-sm sm:rounded-lg" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign in
          </Button>

          <p className="mt-4 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-amber-600 hover:text-amber-500">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
