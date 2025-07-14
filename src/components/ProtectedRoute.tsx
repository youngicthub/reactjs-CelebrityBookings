import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  requiredRole = "user",
  redirectTo = "/auth",
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();


  useEffect(() => {
   try {

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {

      console.log("====>", session)
      if(!session){

        toast({
          title: "Error",
          description: "Admin not logged in",
          variant: "destructive",
        });
        navigate('/admin/auth')
      }
    });
    return () => listener.subscription.unsubscribe();

   } catch (error) {
    console.log("An error occured",error)
   }
  }, []);

  // console.log('===>>>', session.user.email)

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Verifying access...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
