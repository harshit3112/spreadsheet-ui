import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid token",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.login(token);
      toast({
        title: "Success",
        description: "Logged in successfully"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid token or login failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      await authApi.login('test-token');
      toast({
        title: "Success",
        description: "Logged in with test token"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Test login failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login to Spreadsheet
          </CardTitle>
          <CardDescription className="text-center">
            Enter your Bearer token to access the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">
                Bearer Token
              </label>
              <Input
                id="token"
                type="password"
                placeholder="Enter your authentication token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t">
            <div className="text-center mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Development Mode (Test Token)</h3>
              <p className="text-xs text-muted-foreground mt-1">Use this for testing without a real token</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleTestLogin}
              disabled={isLoading}
            >
              Login with Test Token
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
