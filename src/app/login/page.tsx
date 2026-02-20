import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { tableSlugs } from "@/utils/table";

export default function LoginPage() {
  return (
    <main className="flex h-svh items-center justify-center px-4 py-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Login Card */}

        <Card>
          <div className="w-full h-full flex justify-center">
            <Image
              src="/favicon.png"
              alt="Warm architectural detail"
              width={100}
              height={100}
              className="object-cover"
              priority
            />
          </div>

          <CardContent className="flex flex-col gap-6 pl-5 pr-5">
            {/* Header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground text-balance">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign in to your account to continue where you left off.
              </p>
            </div>

            {/* Form */}
            <LoginForm tableSlugs={tableSlugs} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
