"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { RoleTypes } from "@/types/prisma/RBACTypes";
import {
  AlignJustify,
  Bell,
  MonitorCog,
  HistoryIcon,
  UserCog,
} from "lucide-react";
import { ImageInventory } from "@/images/ImageInventory";
import { useAppContext } from "@/lib/context/AppContext";
import { Separator } from "../ui/separator";
import { ROUTES, ROUTES_PATH } from "@/lib/route";
import { useRouter } from "next-nprogress-bar";
import { useSession } from "next-auth/react";

const NavigationComponent = () => {
  const { data: session } = useSession();
  const {
    toggleSidebar,
    showNavigation,
    showSidebar,
    isMobile,
  } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  if (!session) return null;

  if (!showNavigation) return null;

  const handleLinkClick = (link: string) => {
    if (isMobile) {
      toggleSidebar(false);
    }
    router.push(link);
  };

  return (
    <>
      <div
        className={`transition-all hidden text-base sm:hidden md:block lg:block xl:block duration-300 ${
          showSidebar
            ? "min-w-[260px] w-[260px] max-w-[260px]"
            : "min-w-[0] w-[0] max-w-[0]"
        }`}
      ></div>
      <div
        className={`fixed z-[1000] h-full transition-all duration-300 ${
          showSidebar ? "w-screen sm:w-screen md:w-[260px]" : "w-0"
        }`}
      >
        {/* Overlay for small screens */}
        {showSidebar && (
          <div
            onClick={() => toggleSidebar(false)}
            className="fixed z-0 inset-0 bg-black bg-opacity-50 transition-opacity duration-300 sm:hidden"
          ></div>
        )}
        <nav
          className={`bg-purple-950 min-w-[260px] w-[260px] max-w-[260px] flex flex-col h-full overflow-hidden transition-transform duration-300 ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex w-full justify-between overflow-hidden p-2">
            <div className="flex items-center justify-center p-2 py-1">
              <Image
                src={ImageInventory.Logo.small}
                alt="Logo"
                className="w-[30px] h-[30px] "
                priority
              />
              <div className="flex ml-2">
                <h1
                  className={`text-2xl text-center font-bold text-md text-purple-400`}
                >
                  Intl
                </h1>
                <h1
                  className={`text-s text-center font-bold text-md text-white`}
                >
                  @CMU
                </h1>
              </div>
            </div>
            {showSidebar && (
              <div
                onClick={() => toggleSidebar(false)}
                className="flex items-center justify-center w-[35px] h-[35px] rounded-md border border-purple-50 hover:border-purple-400 my-auto mr-1 text-white cursor-pointer"
              >
                <AlignJustify className="w-[20px] h-[20px]" />
              </div>
            )}
          </div>
          <Separator className="bg-purple-800" />
          <div className="flex-grow flex flex-col overflow-auto ">
            {/* Navigation Links */}
            <nav className="flex flex-grow flex-col cursor-pointer gap-2">
              <div>
                <div
                  onClick={() => handleLinkClick(ROUTES.DASHBOARD)}
                  className={`flex items-center text-sm font-medium px-4 pl-3 py-3 ${
                    pathname.startsWith(ROUTES_PATH.DASHBOARD)
                      ? "bg-purple-800 text-white border-l-4 border-white"
                      : "hover:bg-rose-400 text-white pl-4"
                  }`}
                >
                  <div className="relative">
                    <Bell className="mr-4 absolute top-[50%] translate-y-[-50%]" />
                    <p
                      className={`ml-10 ${
                        pathname.startsWith(ROUTES_PATH.DASHBOARD)
                          ? "font-bold"
                          : "font-normal"
                      }`}
                    >
                      Notification Setting
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => handleLinkClick(ROUTES_PATH.DISPLAY)}
                  className={`flex items-center text-sm font-medium px-4 pl-3 py-3 ${
                    pathname.startsWith(ROUTES_PATH.DISPLAY)
                      ? "bg-purple-800 text-white border-l-4"
                      : "hover:bg-rose-400 text-white pl-4"
                  }`}
                >
                  <div className="relative">
                    <MonitorCog className="mr-4 absolute top-[50%] translate-y-[-50%]" />
                    <p
                      className={`ml-10 ${
                        pathname.startsWith(ROUTES_PATH.DISPLAY)
                          ? "font-bold"
                          : "font-normal"
                      }`}
                    >
                      Display Setting
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => handleLinkClick(ROUTES_PATH.HISTORY)}
                  className={`flex items-center text-sm font-medium px-4 pl-3 py-3 ${
                    pathname.startsWith(ROUTES_PATH.HISTORY)
                      ? "bg-purple-800 text-white border-l-4"
                      : "hover:bg-rose-400 text-white pl-4"
                  }`}
                >
                  <div className="relative">
                    <HistoryIcon className="mr-4 absolute top-[50%] translate-y-[-50%]" />
                    <p
                      className={`ml-10 ${
                        pathname.startsWith(ROUTES_PATH.HISTORY)
                          ? "font-bold"
                          : "font-normal"
                      }`}
                    >
                      Notification History
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="bg-purple-800" />
              <div className="flex-grow flex flex-col overflow-auto"></div>
              {/* <div
                onClick={() => handleLinkClick(ROUTES_PATH.DISPLAY)}
                className={`flex items-center text-sm font-medium px-4 pl-3 py-3 ${
                  pathname.startsWith(ROUTES_PATH.DISPLAY)
                    ? "bg-green-800 text-white border-l-4"
                    : "hover:bg-green-500 text-white pl-4"
                }`}
              >
                <div className="relative ">
                  <UserCog className="mr-4 absolute top-[50%] translate-y-[-50%]" />
                  <p
                    className={`ml-10 ${
                      pathname.startsWith(ROUTES_PATH.DISPLAY)
                        ? "font-bold"
                        : "font-normal"
                    }`}
                  >
                    ตั้งค่าบทบาท
                  </p>
                </div>
              </div> */}
            </nav>
          </div>
          {session &&
            session.user &&
            (session.user.role === RoleTypes.Admin ||
              session.user.role === RoleTypes.SuperAdmin) && (
              <>
                <Separator />
                <div
                  onClick={() => handleLinkClick(ROUTES.ADMIN_ACCESS_CONTROL)}
                  className={`flex cursor-pointer items-center justify-center text-base font-medium bg-green-600 transition-all hover:bg-slate-800 px-4 pl-3 py-3 text-yellow-200`}
                >
                  <div className="relative">
                    <UserCog className="mr-4 absolute top-[50%] translate-y-[-50%]" />
                    <p className="ml-10 text-sm cursor-pointer">Role Management</p>
                  </div>
                </div>
              </>
            )}
        </nav>
      </div>
    </>
  );
};

export default NavigationComponent;
