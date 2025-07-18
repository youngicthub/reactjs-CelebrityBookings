import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_SECRET_KEY = "CELEBRITY_ADMIN_2024"; // Change this secret key

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();



  const checkUserRole = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

      console.log('===>', data)

  };

  useEffect(() => {
    if (user) {
      // checkUserRole();
    }
  }, [user, navigate]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Sign in directly without using AuthContext to avoid automatic redirect
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      }


      navigate('/admin')
      console.log('Login successfully====>', data.user);

      // else if (data.user) {
      // // Check if user is admin
      // const { data: profile } = await supabase
      //   .from('profiles')
      //   .select('role')
      //   .eq('user_id', data.user.id)
      //   .single();
      // console.log("Logged in succesfully===>", profile)
      // if (profile?.role === 'admin') {
      //   window.location.href = '/admin';
      // } else {
      //   toast({
      //     title: "Access Denied",
      //     description: "You don't have admin privileges.",
      //     variant: "destructive",
      //   });
      //   await supabase.auth.signOut();
      //   navigate('/');
      // }
      // }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !secretKey) {
      toast({
        title: "Error",
        description: "Please fill in all fields including the secret key",
        variant: "destructive",
      });
      return;
    }

    if (secretKey !== ADMIN_SECRET_KEY) {
      toast({
        title: "Invalid Secret Key",
        description: "The secret key you entered is incorrect",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password);
      let { error } = result;
      console.log("Error===>>>", error);

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Wait for auth state to settle, then update profile
        setTimeout(async () => {
          try {
            const { data: session } = await supabase.auth.getSession();
            if (session.session?.user) {
              // Insert or update the profile with admin role
              await supabase.from("profiles").upsert({
                user_id: session.session.user.id,
                email: session.session.user.email,
                full_name: "Admin User",
                role: "admin",
              });
            }
          } catch (profileError) {
            console.error("Error updating profile:", profileError);
          }
        }, 1000);

        toast({
          title: "Admin Account Created",
          description: "Check your email for confirmation, then sign in",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Admin Access
          </CardTitle>
          <CardDescription>
            Administrative portal for Celebrity Booking System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Admin Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleAdminSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-signin-email">Admin Email</Label>
                  <Input
                    id="admin-signin-email"
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-signin-password">Password</Label>
                  <Input
                    id="admin-signin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In as Admin"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleAdminSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-secret">Secret Key</Label>
                  <Input
                    id="admin-secret"
                    type="password"
                    placeholder="Enter admin secret key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-signup-email">Admin Email</Label>
                  <Input
                    id="admin-signup-email"
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-signup-password">Password</Label>
                  <Input
                    id="admin-signup-password"
                    type="password"
                    placeholder="Create admin password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating admin..." : "Create Admin Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="text-sm"
            >
              Back to Main Site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
