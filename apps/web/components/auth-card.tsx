"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

type Mode = "login" | "register";

export function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: Mode = searchParams.get("mode") === "register" ? "register" : "login";
  const next = searchParams.get("next");
  const redirectTo = next?.startsWith("/") && !next.startsWith("//") ? next : undefined;

  const setMode = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", value);
    router.replace(`/auth?${params.toString()}`, { scroll: false });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{mode === "login" ? "Welcome back" : "Create an account"}</CardTitle>
        <CardDescription>
          {mode === "login" ? "Sign in to continue to your dashboard" : "Enter your details to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={setMode} className="gap-6">
          <TabsList className="w-full">
            <TabsTrigger value="login">Sign in</TabsTrigger>
            <TabsTrigger value="register">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm redirectTo={redirectTo} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm redirectTo={redirectTo} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}