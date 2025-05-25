
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  studentId: FileList;
}

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const { toast } = useToast();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      const user = userCredential.user;
      
      // Upload student ID card if provided
      let studentIdUrl = '';
      if (data.studentId && data.studentId[0]) {
        const file = data.studentId[0];
        const storageRef = ref(storage, `student-ids/${user.uid}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        studentIdUrl = await getDownloadURL(snapshot.ref);
      }
      
      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        studentIdUrl,
        createdAt: new Date()
      });
      
      toast({
        title: "অ্যাকাউন্ট তৈরি সফল!",
        description: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "রেজিস্ট্রেশন ব্যর্থ",
        description: error.message || "অ্যাকাউন্ট তৈরিতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-center">নতুন অ্যাকাউন্ট তৈরি করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-white">পূর্ণ নাম *</Label>
            <Input
              id="fullName"
              {...register('fullName', { required: 'পূর্ণ নাম প্রয়োজন' })}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              placeholder="আপনার পূর্ণ নাম লিখুন"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-white">ইমেইল ঠিকানা *</Label>
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
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-white">পাসওয়ার্ড *</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { 
                required: 'পাসওয়ার্ড প্রয়োজন',
                minLength: {
                  value: 6,
                  message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
                }
              })}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              placeholder="কমপক্ষে ৬ অক্ষর"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-white">ফোন নম্বর *</Label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber', { 
                required: 'ফোন নম্বর প্রয়োজন',
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: 'সঠিক ফোন নম্বর দিন'
                }
              })}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              placeholder="+880 1XXXXXXXXX"
            />
            {errors.phoneNumber && (
              <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="studentId" className="text-white">স্টুডেন্ট আইডি কার্ড (ঐচ্ছিক)</Label>
            <div className="mt-1">
              <Input
                id="studentId"
                type="file"
                accept="image/*,.pdf"
                {...register('studentId')}
                className="bg-white/10 border-white/20 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
              />
              <p className="text-gray-400 text-sm mt-1">
                <Upload className="inline h-4 w-4 mr-1" />
                ছবি বা PDF ফাইল আপলোড করুন
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                অ্যাকাউন্ট তৈরি হচ্ছে...
              </>
            ) : (
              'অ্যাকাউন্ট তৈরি করুন'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
