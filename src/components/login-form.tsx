"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TTableSlug } from "@/types";

export function LoginForm({ tableSlugs }: { tableSlugs: TTableSlug[] }) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL || ""}/api/users/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: value.email,
              password: value.password,
            }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          setServerError(
            data?.errors?.[0]?.message ||
              data?.message ||
              "Invalid email or password.",
          );
          return;
        }

        router.push(`/${tableSlugs[0]}`);
      } catch {
        setServerError("Unable to connect to the server. Please try again.");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "Email is required";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
              return "Please enter a valid email";
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              }
              className="h-11"
            />
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.toString()}
                </p>
              )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onBlur: ({ value }) => {
            if (!value) return "Password is required";
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
                className="h-11 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <div className="flex">
              <HoverCard openDelay={10} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Button className="ml-auto" variant="link">
                    Forgot password?
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="flex w-46 flex-col gap-0.5">
                  <div className="w-auto">¯\_(ツ)_/¯</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Contact your admin for reset
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.toString()}
                </p>
              )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [
          state.canSubmit,
          state.isSubmitting,
          state.isDirty,
        ]}
      >
        {([canSubmit, isSubmitting, isDirty]) => (
          <Button
            type="submit"
            size="lg"
            disabled={!isDirty || !canSubmit || isSubmitting}
            className="h-11 w-full text-sm font-medium tracking-wide"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
