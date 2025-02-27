
import { generatePath, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/constants/routes";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMobile } from "@/hooks/use-mobile";

import { useGetUser } from "@/api/core";
import { useGetApplicationZs } from "@/api/core";

const Profile = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const { data: user, isLoading: isLoadingUser } = useGetUser();
  const { data: applicationZs, isLoading: isLoadingApplicationZs } = useGetApplicationZs();

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-[1024px] space-y-8 animate-fadeIn">
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between'} items-center`}>
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-semibold text-white`}>EasyappZ</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="bg-[#ea384c] hover:bg-[#d1293c] text-white font-medium px-4 py-2 rounded-xl transition-colors duration-200"
            >
              Выйти
            </button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full mt-8">
          <div className="bg-[#1A1F2C]/80 rounded-md p-2 max-w-md">
            <TabsList className="grid w-full grid-cols-2 bg-transparent">
              <TabsTrigger value="profile" className="text-white py-2.5">Профиль</TabsTrigger>
              <TabsTrigger value="apps" className="text-white py-2.5">Мои приложения</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="mt-6">
            <div className="glass-effect p-6 rounded-lg">
              {isLoadingUser ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-36" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white text-lg break-all">{user?.email}</p>
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-sm text-gray-400">Username</label>
                    <p className="text-white text-lg">{user?.name}</p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="apps" className="mt-6">
            <div className="space-y-4">
              <button
                onClick={() => {
                  navigate(generatePath(ROUTES.APPLICATIONZ, {
                    applicationzId: '',
                  }));
                }}
                className="w-full glass-effect p-5 flex items-center justify-center gap-2 text-white hover:bg-white/10 transition-colors duration-200 rounded-lg"
              >
                <Plus size={24} />
                <span className="text-base">Создать новое приложение</span>
              </button>

              {isLoadingApplicationZs ? (
                <>
                  <Skeleton className="h-[100px] w-full rounded-lg" />
                  <Skeleton className="h-[100px] w-full rounded-lg" />
                </>
              ) : (
                applicationZs?.applications.map((app) => (
                  <button
                    key={app._id}
                    onClick={() => {
                      navigate(generatePath(ROUTES.APPLICATIONZ, {
                        applicationzId: app._id,
                      }));
                    }}
                    className="w-full text-left glass-effect p-5 hover:bg-white/10 transition-colors duration-200 rounded-lg"
                  >
                    <h3 className="text-xl font-medium text-white">{app.name}</h3>
                    <p className="text-gray-400 mt-2">{app.description}</p>
                  </button>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
