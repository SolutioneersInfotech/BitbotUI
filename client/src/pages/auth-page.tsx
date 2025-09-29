// import { useState, useEffect } from "react";
// import { useAuth } from "@/hooks/use-auth";
// import { useLocation } from "wouter";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { TrendingUp, Shield, BarChart3, Zap } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function AuthPage() {
//   const { user, loginMutation, registerMutation } = useAuth();
//   const [, setLocation] = useLocation();
//   const [loginData, setLoginData] = useState({ email: "", password: "" });
//   const [registerData, setRegisterData] = useState({
//     email: "",
//     password: "",
//     firstName: "",
//     lastName: "",
//   });

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user) {
//       setLocation("/");
//     }
//   }, [user, setLocation]);

//   if (user) {
//     return null;
//   }
//   const navigate = useNavigate();
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // await loginMutation.mutateAsync({ 
//     //   email: loginData.email, 
//     //   password: loginData.password 
//     // });
//     navigate("/");
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // await registerMutation.mutateAsync(registerData);
//   };

//   return (
//     <div className="min-h-screen bg-trading-dark flex">
//       {/* Left side - Auth Forms */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <div className="w-full max-w-md space-y-8">
//           <div className="text-center">
//             <div className="flex items-center justify-center mb-4">
//               <TrendingUp className="h-8 w-8 text-trading-success mr-2" />
//               <h1 className="text-3xl font-bold text-white">TradePro</h1>
//             </div>
//             <p className="text-gray-400">Professional Trading Platform</p>
//           </div>

//           <Tabs defaultValue="login" className="space-y-6">
//             <TabsList className="grid w-full grid-cols-2 bg-trading-card">
//               <TabsTrigger value="login" data-testid="tab-login">Sign In</TabsTrigger>
//               <TabsTrigger value="register" data-testid="tab-register">Sign Up</TabsTrigger>
//             </TabsList>

//             <TabsContent value="login">
//               <Card className="bg-trading-card border-gray-700">
//                 <CardHeader>
//                   <CardTitle className="text-white text-center">Welcome Back</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleLogin} className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="login-email" className="text-gray-300">Email</Label>
//                       <Input
//                         id="login-email"
//                         type="email"
//                         value={loginData.email}
//                         onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
//                         className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
//                         placeholder="Enter your email"
//                         required
//                         data-testid="input-login-email"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="login-password" className="text-gray-300">Password</Label>
//                       <Input
//                         id="login-password"
//                         type="password"
//                         value={loginData.password}
//                         onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
//                         className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
//                         placeholder="Enter your password"
//                         required
//                         data-testid="input-login-password"
//                       />
//                     </div>
//                     <Button
//                       type="submit"
//                       className="w-full bg-trading-info hover:bg-blue-600"
//                       disabled={loginMutation.isPending}
//                       data-testid="button-login-submit"
//                     >
//                       {loginMutation.isPending ? "Signing In..." : "Sign In"}
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="register">
//               <Card className="bg-trading-card border-gray-700">
//                 <CardHeader>
//                   <CardTitle className="text-white text-center">Create Account</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleRegister} className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="first-name" className="text-gray-300">First Name</Label>
//                         <Input
//                           id="first-name"
//                           value={registerData.firstName}
//                           onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
//                           className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
//                           placeholder="First name"
//                           data-testid="input-register-firstname"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="last-name" className="text-gray-300">Last Name</Label>
//                         <Input
//                           id="last-name"
//                           value={registerData.lastName}
//                           onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
//                           className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
//                           placeholder="Last name"
//                           data-testid="input-register-lastname"
//                         />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="register-email" className="text-gray-300">Email</Label>
//                       <Input
//                         id="register-email"
//                         type="email"
//                         value={registerData.email}
//                         onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
//                         className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
//                         placeholder="Enter your email"
//                         required
//                         data-testid="input-register-email"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="register-password" className="text-gray-300">Password</Label>
//                       <Input
//                         id="register-password"
//                         type="password"
//                         value={registerData.password}
//                         onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
//                         className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
//                         placeholder="Create a password"
//                         required
//                         data-testid="input-register-password"
//                       />
//                     </div>
//                     <Button
//                       type="submit"
//                       className="w-full bg-trading-info hover:bg-blue-600"
//                       disabled={registerMutation.isPending}
//                       data-testid="button-register-submit"
//                     >
//                       {registerMutation.isPending ? "Creating Account..." : "Create Account"}
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>

//       {/* Right side - Hero Section */}
//       <div className="hidden lg:flex lg:w-1/2 gradient-bg items-center justify-center p-8">
//         <div className="text-center space-y-8 max-w-lg">
//           <div>
//             <h2 className="text-4xl font-bold text-white mb-4">
//               Trade Like a Pro
//             </h2>
//             <p className="text-xl text-gray-300">
//               Advanced technical analysis, real-time market data, and AI-powered trading signals
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="text-center">
//               <div className="bg-trading-success bg-opacity-20 rounded-lg p-4 mb-3">
//                 <BarChart3 className="h-8 w-8 text-trading-success mx-auto" />
//               </div>
//               <h3 className="font-semibold text-white mb-2">Technical Analysis</h3>
//               <p className="text-sm text-gray-400">
//                 Advanced indicators and chart patterns
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="bg-trading-info bg-opacity-20 rounded-lg p-4 mb-3">
//                 <Zap className="h-8 w-8 text-trading-info mx-auto" />
//               </div>
//               <h3 className="font-semibold text-white mb-2">Real-time Data</h3>
//               <p className="text-sm text-gray-400">
//                 Live market updates and price feeds
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="bg-trading-warning bg-opacity-20 rounded-lg p-4 mb-3">
//                 <TrendingUp className="h-8 w-8 text-trading-warning mx-auto" />
//               </div>
//               <h3 className="font-semibold text-white mb-2">Smart Signals</h3>
//               <p className="text-sm text-gray-400">
//                 AI-powered buy/sell recommendations
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="bg-trading-purple bg-opacity-20 rounded-lg p-4 mb-3">
//                 <Shield className="h-8 w-8 text-trading-purple mx-auto" />
//               </div>
//               <h3 className="font-semibold text-white mb-2">Secure Trading</h3>
//               <p className="text-sm text-gray-400">
//                 Bank-level security and encryption
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Shield, BarChart3, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { user, login, register, isLoading, error } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  if (user) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginData); // ✅ bas API call, redirect useEffect se hoga
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(registerData); // ✅ bas API call, redirect useEffect se hoga
  };

  return (
    <div className="min-h-screen bg-trading-dark flex">
      {/* Left side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-trading-success mr-2" />
              <h1 className="text-3xl font-bold text-white">TradePro</h1>
            </div>
            <p className="text-gray-400">Professional Trading Platform</p>
          </div>

          {/* ✅ Error Message */}
          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-trading-card">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* 🔹 Login Form */}
            <TabsContent value="login">
              <Card className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    Welcome Back
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-email"
                        className="text-gray-300"
                      >
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            email: e.target.value,
                          })
                        }
                        className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-password"
                        className="text-gray-300"
                      >
                        Password
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-trading-info hover:bg-blue-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 🔹 Register Form */}
            <TabsContent value="register">
              <Card className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    Create Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="first-name"
                          className="text-gray-300"
                        >
                          First Name
                        </Label>
                        <Input
                          id="first-name"
                          value={registerData.firstName}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              firstName: e.target.value,
                            })
                          }
                          className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="last-name"
                          className="text-gray-300"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="last-name"
                          value={registerData.lastName}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              lastName: e.target.value,
                            })
                          }
                          className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="register-email"
                        className="text-gray-300"
                      >
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="register-password"
                        className="text-gray-300"
                      >
                        Password
                      </Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="bg-trading-dark border-gray-600 text-white focus:border-trading-info"
                        placeholder="Create a password"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-trading-info hover:bg-blue-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg items-center justify-center p-8">
        <div className="text-center space-y-8 max-w-lg">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Trade Like a Pro
            </h2>
            <p className="text-xl text-gray-300">
              Advanced technical analysis, real-time market data, and
              AI-powered trading signals
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-trading-success bg-opacity-20 rounded-lg p-4 mb-3">
                <BarChart3 className="h-8 w-8 text-trading-success mx-auto" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                Technical Analysis
              </h3>
              <p className="text-sm text-gray-400">
                Advanced indicators and chart patterns
              </p>
            </div>

            <div className="text-center">
              <div className="bg-trading-info bg-opacity-20 rounded-lg p-4 mb-3">
                <Zap className="h-8 w-8 text-trading-info mx-auto" />
              </div>
              <h3 className="font-semibold text-white mb-2">Real-time Data</h3>
              <p className="text-sm text-gray-400">
                Live market updates and price feeds
              </p>
            </div>

            <div className="text-center">
              <div className="bg-trading-warning bg-opacity-20 rounded-lg p-4 mb-3">
                <TrendingUp className="h-8 w-8 text-trading-warning mx-auto" />
              </div>
              <h3 className="font-semibold text-white mb-2">Smart Signals</h3>
              <p className="text-sm text-gray-400">
                AI-powered buy/sell recommendations
              </p>
            </div>

            <div className="text-center">
              <div className="bg-trading-purple bg-opacity-20 rounded-lg p-4 mb-3">
                <Shield className="h-8 w-8 text-trading-purple mx-auto" />
              </div>
              <h3 className="font-semibold text-white mb-2">Secure Trading</h3>
              <p className="text-sm text-gray-400">
                Bank-level security and encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

