
import { generatePath, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/constants/routes";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/use-mobile";

import { useGetUser } from "@/api/core";
import { useGetApplications } from "@/api/core";

const Profile = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const { data: user, isLoading: isLoadingUser } = useGetUser();
  const { data: applications, isLoading: isLoadingApplications } = useGetApplications();

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-8 profile-page">
      <div className="w-full max-w-[1024px] space-y-8 animate-fadeIn">
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between'} items-center`}>
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-semibold profile-text`}>EasyappZ</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(ROUTES.WELCOME)}
              className="bg-[#ea384c] hover:bg-[#d1293c] text-white font-medium px-4 py-2 rounded-xl transition-colors duration-200"
            >
              Выйти
            </button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full mt-8">
          <div className="profile-tab-header rounded-md p-2 max-w-md">
            <TabsList className="grid w-full grid-cols-2 bg-transparent">
              <TabsTrigger value="profile" className="profile-tab-trigger py-2.5">Профиль</TabsTrigger>
              <TabsTrigger value="apps" className="profile-tab-trigger py-2.5">Мои приложения</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="mt-6">
            <div className="profile-card p-6 rounded-lg">
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
                    <label className="text-sm profile-label">Email</label>
                    <p className="profile-text text-lg break-all">{user?.email}</p>
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-sm profile-label">Username</label>
                    <p className="profile-text text-lg">{user?.name}</p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="apps" className="mt-6">
            <div className="space-y-4">
              <button
                onClick={() => {
                  navigate(generatePath(ROUTES.APPLICATION, {
                    applicationId: '',
                  }));
                }}
                className="w-full profile-card p-5 flex items-center justify-center gap-2 profile-text hover:bg-white/10 transition-colors duration-200 rounded-lg"
              >
                <Plus size={24} />
                <span className="text-base">Создать новое приложение</span>
              </button>

              {isLoadingApplications ? (
                <>
                  <Skeleton className="h-[100px] w-full rounded-lg" />
                  <Skeleton className="h-[100px] w-full rounded-lg" />
                </>
              ) : (
                applications?.applications.map((app) => (
                  <button
                    key={app._id}
                    onClick={() => {
                      navigate(generatePath(ROUTES.APPLICATION, {
                        applicationId: app._id,
                      }));
                    }}
                    className="w-full text-left profile-card p-5 hover:bg-white/10 transition-colors duration-200 rounded-lg"
                  >
                    <h3 className="text-xl font-medium profile-text">{app.name}</h3>
                    <p className="profile-label mt-2">{app.description}</p>
                    <p className="profile-label mt-2">Модель ИИ: {app.service}</p>
                    {app.pending && (
                      <p className="profile-label mt-2">Обрабатывается ({(app.pendingPercent || 0)}%)...</p>
                    )}
                    {app.error && (
                      <p className="profile-label mt-2">Ошибка: {app.errorText}</p>
                    )}
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
