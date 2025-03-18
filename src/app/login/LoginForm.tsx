"use client";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ImageInventory } from "@/images/ImageInventory";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const credentialsAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Email and Password are required");
      return;
    }

    setIsLoading(true);
    await signIn("credentials", {
      redirect: true,
      username: email,
      password,
    });
    setIsLoading(false);

    // if (result?.error) {
    //     toast.error(result.error);
    // } else {
    //     router.push("/dashboard");
    // }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", {
      callbackUrl: callbackUrl,
      prompt: "login",
    });
    setIsLoading(false);
  };

  return (
    <div className="flex-col w-full justify-start items-center gap-8 inline-flex">
      <div className="flex flex-col w-full items-center">
        <Image
          alt="cmuws"
          src={ImageInventory.Logo.medium}
          style={{ width: "250px" }}
          priority
        />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          credentialsAction(new FormData(e.currentTarget));
        }}
        className="w-full flex flex-col gap-8"
      >
        <label htmlFor="credentials-email" className="block">
          <span className="block text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            id="credentials-email"
            name="email"
            required
            className="mt-1 p-2 w-full border text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
        <label htmlFor="credentials-password" className="block relative">
          <span className="flex justify-between text-sm font-medium text-gray-700">
            Password <div className="text-blue-500">Forgot?</div>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            id="credentials-password"
            name="password"
            required
            className="mt-1 p-2 w-full border text-black border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 top-[50%] translate-y-[-4px] flex items-center text-gray-500"
            aria-label="Toggle password visibility"
          >
            {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </label>
        <button
          type="submit"
          className="self-stretch flex-col justify-center items-center gap-2.5 flex"
        >
          <Button className="self-stretch h-[50px] px-6 py-2 bg-violet-600 hover:bg-violet-900 rounded justify-center items-center gap-2.5 inline-flex">
            <div className="text-white text-base font-normal leading-[21px]">
              {isLoading ? "Logging In..." : "Log In"}
            </div>
          </Button>
        </button>
      </form>
      <div className="self-stretch justify-center items-center gap-4 inline-flex">
        <div className="grow shrink basis-0 h-[0px] border border-violet-300"></div>
        <div className="text-[#3d3d3d] text-sm font-normal leading-[21px]">
          OR
        </div>
        <div className="grow shrink basis-0 h-[0px] border border-violet-300"></div>
      </div>
      <button
        onClick={handleGoogleSignIn}
        className="self-stretch rounded-[10px] border transition-colors bg-white hover:bg-violet-50 border-violet-100 justify-center items-center gap-8 inline-flex"
      >
        <div className="grow shrink basis-0 h-14 px-2 py-2 justify-center items-center gap-4 flex">
          <Image alt="cmu" src={ImageInventory.icons.google} height={20} />
          <div className="text-[#605CA4] font-bold text-base leading-[21px]">
            Sign in with Google{" "}
          </div>
        </div>
      </button>
    </div>
  );
}
