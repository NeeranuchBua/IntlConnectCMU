"use client";

import { ImageInventory } from "@/images/ImageInventory";
import { UserVerificationStatus } from "@/types/prisma/UserVerificationStatus";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/context/AppContext";
import { LoginForm } from "./LoginForm";
import { ROUTES } from "@/lib/route";

interface LoginPageProps {
  session: Session | null;
}

const LoginPage = ({ session }: LoginPageProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") || ROUTES.DASHBOARD;
  const [loading, setLoading] = useState(true);
  const { isMobile } = useAppContext();

  useEffect(() => {
    if (
      session?.user &&
      session.user.status === UserVerificationStatus.VERIFIED
    ) {
      router.push(callbackUrl);
    } else {
      setLoading(false);
    }
  }, [session, callbackUrl, router]);

  if (loading) {
    return null;
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
        <Image
            src={ImageInventory.cmuBG.src}
            alt="CMU Background"
            priority
            width={0}
            height={0}
            sizes="100vw"
            className="z-0 object-cover absolute w-screen h-screen"
        />
      {!isMobile && (
        <div
          className="z-10 flex justify-center items-center w-full h-full"
        >
          <div className="flex flex-col items-center gap-8 w-[500px] p-[32px_32px] rounded-[8px] border border-white bg-white/80">
            <LoginForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
