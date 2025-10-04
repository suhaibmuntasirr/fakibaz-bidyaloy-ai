
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
    <Card className="bg-transparent backdrop-blur-lg border-0 bg-gradient-to-r from-white/5 via-blue-500/10 via-purple-500/10 to-pink-500/10 p-[1px] rounded-2xl">
      <CardHeader className="bg-transparent">
        <CardTitle className="text-white text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">লগইন করুন</CardTitle>
      </CardHeader>
      <CardContent className="bg-transparent">
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
              className="bg-transparent border-0 bg-gradient-to-r from-white/5 via-blue-500/10 via-purple-500/10 to-pink-500/10 p-[1px] rounded-lg"
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
              className="bg-transparent border-0 bg-gradient-to-r from-white/5 via-blue-500/10 via-purple-500/10 to-pink-500/10 p-[1px] rounded-lg text-white placeholder:text-gray-400"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className={`w-full ${isLoading ? 'bg-gradient-to-r from-blue-400 via-blue-600 via-purple-600 via-purple-400 to-pink-500' : 'bg-blue-600 hover:bg-gradient-to-r hover:from-blue-400 hover:via-blue-600 hover:via-purple-600 hover:via-purple-400 hover:to-pink-500'} text-white transition-all duration-300`}
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
      </CardContent>
    </Card>
  );
};

export default LoginForm;
