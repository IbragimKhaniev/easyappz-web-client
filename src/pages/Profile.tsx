
import { generatePath, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/constants/routes";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";

import { useGetUser } from "@/api/core";
import { useGetApplicationZs } from "@/api/core";

const Profile = () => {
  const navigate = useNavigate();

  const { data: user, isLoading: isLoadingUser } = useGetUser();

  const { data: applicationZs, isLoading: isLoadingApplicationZs } = useGetApplicationZs();

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-[1024px] space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-semibold text-white">EasyappZ</h1>
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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="apps">Мои приложения</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <div className="glass-effect p-6 space-y-4">
              {isLoadingUser ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-36" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white text-lg">{user?.email}</p>
                  </div>
                  <div className="space-y-2">
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
                className="w-full glass-effect p-6 flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors duration-200 group border border-dashed border-white/20 hover:border-white/40"
              >
                <Plus size={20} className="group-hover:scale-110 transition-transform duration-200" />
                <span>Создать новое приложение</span>
              </button>

              {isLoadingApplicationZs ? (
                <>
                  <Skeleton className="h-[100px] w-full" />
                  <Skeleton className="h-[100px] w-full" />
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
                    className="w-full text-left glass-effect p-6 hover:bg-white/5 transition-colors duration-200"
                  >
                    <h3 className="text-xl font-medium text-white mb-2">{app.name}</h3>
                    <p className="text-gray-400">{app.description}</p>
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
