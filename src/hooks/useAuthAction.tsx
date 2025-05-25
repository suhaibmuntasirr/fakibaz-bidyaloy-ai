
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuthAction = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (callback: () => void) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    callback();
  };

  return { requireAuth, isAuthenticated: !!currentUser };
};
