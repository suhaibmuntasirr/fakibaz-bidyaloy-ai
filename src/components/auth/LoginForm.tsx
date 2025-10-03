
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { toast } = useToast();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      toast({
        title: "লগইন সফল!",
        description: "আপনি সফলভাবে লগইন করেছেন।",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "লগইন ব্যর্থ",
        description: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-white">ইমেইল ঠিকানা</Label>
        <Input
          id="email"
          type="email"
          {...register('email', { 
            required: 'ইমেইল প্রয়োজন',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'সঠিক ইমেইল ঠিকানা দিন'
            }
          })}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
          placeholder="আপনার ইমেইল লিখুন"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className="text-white">পাসওয়ার্ড</Label>
        <Input
          id="password"
          type="password"
          {...register('password', { required: 'পাসওয়ার্ড প্রয়োজন' })}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
          placeholder="আপনার পাসওয়ার্ড লিখুন"
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            লগইন হচ্ছে...
          </>
        ) : (
          'লগইন করুন'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
