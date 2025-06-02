
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Notes from '@/pages/Notes';
import QuestionBank from '@/pages/QuestionBank';
import Community from '@/pages/Community';
import Subscription from '@/pages/Subscription';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#28282B]">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
