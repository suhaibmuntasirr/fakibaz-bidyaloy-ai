
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, Shield, Check, Star, Crown, 
  DollarSign, Smartphone, Building, Globe 
} from 'lucide-react';
import { paymentService, PaymentPlan } from '@/services/paymentService';
import { analyticsService } from '@/services/analyticsService';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PaymentGateway: React.FC = () => {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'sslcommerz' | 'mobile'>('stripe');
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const availablePlans = await paymentService.getPaymentPlans();
      setPlans(availablePlans);
      if (availablePlans.length > 0) {
        setSelectedPlan(availablePlans[1]); // Default to premium plan
      }
    } catch (error) {
      toast({
        title: "প্ল্যান লোড করতে সমস্যা",
        description: "পরে আবার চেষ্টা করুন",
        variant: "destructive"
      });
    }
  };

  const handleSubscribe = async (plan: PaymentPlan) => {
    if (!currentUser) {
      toast({
        title: "লগইন প্রয়োজন",
        description: "সাবস্ক্রিপশনের জন্য প্রথমে লগইন করুন",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Track subscription attempt
      await analyticsService.trackEvent({
        name: 'subscription_attempt',
        parameters: {
          plan_id: plan.id,
          plan_name: plan.name,
          amount: plan.price,
          payment_method: paymentMethod
        },
        userId: currentUser.uid
      });

      // Create checkout session
      const session = await paymentService.createCheckoutSession(plan.id, currentUser.uid);
      
      if (session.url) {
        // Open payment page in new tab
        window.open(session.url, '_blank');
        
        toast({
          title: "পেমেন্ট পেজ খোলা হয়েছে",
          description: "নতুন ট্যাবে পেমেন্ট সম্পন্ন করুন",
        });
      }
    } catch (error) {
      toast({
        title: "পেমেন্ট শুরু করতে সমস্যা",
        description: "আবার চেষ্টা করুন",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Star className="h-6 w-6" />;
      case 'premium':
        return <Crown className="h-6 w-6" />;
      case 'yearly':
        return <Crown className="h-6 w-6 text-yellow-400" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'from-blue-600 to-blue-800';
      case 'premium':
        return 'from-purple-600 to-purple-800';
      case 'yearly':
        return 'from-yellow-600 to-yellow-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'BDT') {
      return `৳${price}`;
    }
    return `$${price}`;
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-green-400" />
            পেমেন্ট পদ্ধতি
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="stripe" className="data-[state=active]:bg-blue-600">
                <Globe className="mr-2 h-4 w-4" />
                আন্তর্জাতিক
              </TabsTrigger>
              <TabsTrigger value="sslcommerz" className="data-[state=active]:bg-green-600">
                <Building className="mr-2 h-4 w-4" />
                SSLCommerz
              </TabsTrigger>
              <TabsTrigger value="mobile" className="data-[state=active]:bg-orange-600">
                <Smartphone className="mr-2 h-4 w-4" />
                মোবাইল ব্যাংকিং
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stripe" className="mt-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">আন্তর্জাতিক পেমেন্ট</h3>
                <p className="text-gray-400 text-sm mb-3">
                  ভিসা, মাস্টারকার্ড, আমেরিকান এক্সপ্রেস সমর্থিত
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>SSL এনক্রিপ্টেড</span>
                  <span>•</span>
                  <span>PCI DSS কমপ্লায়েন্ট</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sslcommerz" className="mt-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">স্থানীয় পেমেন্ট</h3>
                <p className="text-gray-400 text-sm mb-3">
                  বাংলাদেশী ব্যাংক কার্ড, ডাচ-বাংলা ব্যাংক, BRAC ব্যাংক
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>বাংলাদেশ ব্যাংক অনুমোদিত</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="mt-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">মোবাইল ব্যাংকিং</h3>
                <p className="text-gray-400 text-sm mb-3">
                  bKash, Nagad, Rocket, Upay সমর্থিত
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>তাৎক্ষণিক পেমেন্ট</span>
                  <span>•</span>
                  <span>২৪/৭ উপলব্ধ</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden bg-gradient-to-br ${getPlanColor(plan.id)} border border-white/20 ${
              selectedPlan?.id === plan.id ? 'ring-2 ring-white/50' : ''
            }`}
          >
            {plan.id === 'premium' && (
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                জনপ্রিয়
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-white">
                {formatPrice(plan.price, plan.currency)}
                <span className="text-lg font-normal text-gray-300">
                  /{plan.interval === 'month' ? 'মাস' : 'বছর'}
                </span>
              </div>
              {plan.interval === 'year' && (
                <Badge className="bg-green-600/20 text-green-300 border-green-500/50">
                  ৫০% সাশ্রয়
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-white text-sm">
                    <Check className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-medium"
              >
                {isLoading ? 'প্রক্রিয়াকরণ...' : 'সাবস্ক্রাইব করুন'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Notice */}
      <Card className="bg-green-900/20 border border-green-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="text-white font-medium">নিরাপদ পেমেন্ট</h3>
              <p className="text-green-300 text-sm">
                আপনার তথ্য ২৫৬-বিট SSL এনক্রিপশন দিয়ে সুরক্ষিত। আমরা আপনার কার্ডের তথ্য সংরক্ষণ করি না।
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGateway;
