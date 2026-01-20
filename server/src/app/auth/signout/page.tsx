"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { authClient, signOut, useSession } from "@/server/better-auth/client";
import { useCallback, useEffect } from "react";

export default function SignOutPage() {
  const session = useSession();
    const router = useRouter();

  const signOutCallback = useCallback(async () => {
    if (session) {
      await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                router.replace("/auth/signin");
            },
        }
      })
    }
  }, [session]);

  useEffect(() => {
    signOutCallback();
  }, [session]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-md">
        <div className="p-6 text-center">
          <h1 className="text-lg">You have been signed out.</h1>
        </div>
      </Card>
    </div>
  );
}
