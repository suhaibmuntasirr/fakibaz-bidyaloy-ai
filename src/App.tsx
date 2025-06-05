
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Notes from '@/pages/Notes';
import QuestionBank from '@/pages/QuestionBank';
import Community from '@/pages/Community';
import Subscription from '@/pages/Subscription';
import Settings from '@/components/Settings';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import TermsConditions from '@/pages/TermsConditions';
import RefundPolicy from '@/pages/RefundPolicy';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ProtectedRoute from '@/components/ProtectedRoute';
import AIToggle from '@/components/AIToggle';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#28282B]">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route 
              path="/notes" 
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/question-bank" 
              element={
                <ProtectedRoute>
                  <QuestionBank />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIToggle />
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
