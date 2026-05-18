import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { registerSchema, RegisterInput } from '@/utils/validators';

export function RegisterPage() {
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'sales'
    }
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setApiError('');
      const response = await authApi.register(data);
      if (response.success) {
        login(response.data.user, response.data.token);
        navigate('/');
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Failed to register');
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
            Create a new account
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
              label="Full name"
              type="text"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
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
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Select
              label="Role"
              error={errors.role?.message}
              {...register('role')}
              options={[
                { label: 'Sales', value: 'sales' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Register
          </Button>

          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
