import { auth } from "@/server/better-auth";
import "@/styles/globals.css";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session?.user.id) {
        redirect("/auth/signin");
    }
    

    return (
    <>
        {children}
    </>
  );
}
