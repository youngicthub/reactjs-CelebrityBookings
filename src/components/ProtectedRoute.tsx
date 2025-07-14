import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = 'user', 
  redirectTo = '/auth' 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setUserRole(profile?.role || 'user');
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole('user');
      } finally {
        setChecking(false);
      }
    };

    if (!loading) {
      checkUserRole();
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !checking) {
      if (!user) {
        navigate(redirectTo);
        return;
      }

      if (requiredRole === 'admin' && userRole !== 'admin') {
        navigate('/');
        return;
      }
    }
  }, [user, userRole, loading, checking, navigate, requiredRole, redirectTo]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole === 'admin' && userRole !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;