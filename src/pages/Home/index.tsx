
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button/Button";
import { Navbar } from "@/shared/ui/navbar/Navbar";
import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/lib/utils";

export const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = useCallback(async () => {
    setIsLoading(true);
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate(ROUTES.CHAT);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight fade-in">
            Творите свои лучшие идеи
          </h1>
          <p className="text-xl text-muted-foreground fade-in delay-100">
            Создавайте потрясающие веб-приложения с помощью нашей интуитивно понятной платформы на базе искусственного интеллекта.
            Начните создавать свой следующий проект за считанные минуты.
          </p>
          <div className="fade-in delay-200">
            <Button
              size="lg"
              onClick={handleStart}
              isLoading={isLoading}
              className={cn("mt-8 rounded-[100px]", isLoading && "!w-12 !h-12 !p-0 !rounded-full")}
            >
              Начать
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
