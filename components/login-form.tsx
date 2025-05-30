"use client";

// import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { AuthResponse, useWsAuth } from "@/hooks/use-ws-auth";
// import { signIn } from "@/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  // const { login } = useWsAuth();
  // const credentialsAction = (data: AuthResponse) => {
  //   // signIn("credentials", data);
  // };
  // useEffect(() => {
  //   login().then((data) => {
  //     if (!data) return;
  //     credentialsAction(data);
  //   });
  // }, []);

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  );
}
