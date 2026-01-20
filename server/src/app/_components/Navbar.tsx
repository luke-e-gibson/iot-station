import { Button } from "@/components/ui/button";
import { auth } from "@/server/better-auth";
import { headers } from "next/headers";
import Link from "next/link";

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="flex w-full items-center justify-between border-b border-gray-200 p-3">
      <h1 className="text-lg font-semibold">IOT STATION</h1>

      <div></div>

      <div className="flex justify-between gap-4">
        {session?.user.id ? (
          <>
            <Link href="/auth/signout">
              <Button variant="outline">Sign Out</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
