
import { useCallback, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { EmailInput } from "@/components/EmailConfirmation/EmailInput";
import { OTPVerification } from "@/components/Auth/OTPVerification";
import { ROUTES } from "@/constants/routes";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

import { usePostUser, usePostUserLogin } from "@/api/core";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMobile();

  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { mutate: postUser, isPending: isPendingPostUser, isSuccess: isSuccessPostUser } = usePostUser({
    mutation: {
      onSuccess() {
        /**
         * Даем отобразиться анимации с галочкой
         */
        setTimeout(() => {
          setIsVerifying(true);
        }, 1000);
      },
      onError(errorData) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: errorData.message,
        });
      }
    }
  });

  const { mutate: postUserResend, isPending: isPendingPostUserResend } = usePostUser({
    mutation: {
      onSuccess(data) {
        toast({
          variant: "default",
          title: "Успешно",
          description: data.message || "Код отправлен на почту",
        });
      },
      onError(errorData) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: errorData.message,
        });
      }
    }
  });

  const { mutate: postUserLogin, isPending: isPendingPostUserLogin } = usePostUserLogin({
    mutation: {
      onSuccess() {
        navigate(generatePath(ROUTES.PROFILE));
      },
      onError(errorData) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: errorData.message,
        });
      }
    }
  });

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const handleSubmitEmail = useCallback(async () => {
    postUser({
      data: {
        email, 
      }
    });
  }, [email, postUser]);

  const handleSubmitResend = useCallback(async () => {
    postUserResend({
      data: {
        email, 
      }
    });
  }, [email, postUserResend]);

  const handleSubmitVerifyCode = useCallback(async (code: string) => {
    postUserLogin({
      data: {
        email,
        code,
      }
    });
  }, [email, postUserLogin]);

  const handleBack = useCallback(() => {
    setIsVerifying(false);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 animate-fadeIn">
        {!isVerifying ? (
          <>
            <div className="text-center space-y-3">
              <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-semibold text-foreground`}>
                Творите свои безумные идеи прямо здесь
              </h1>
              <p className="text-muted-foreground text-sm">
                Введите email для входа в приложение
              </p>
            </div>

            <EmailInput
              email={email}
              onChange={handleEmailChange}
              onSubmit={handleSubmitEmail}
              isSubmitting={isPendingPostUser}
              isSuccess={isSuccessPostUser}
            />
          </>
        ) : (
          <OTPVerification 
            email={email} 
            onBack={handleBack}
            onResendCode={handleSubmitResend}
            onSubmit={handleSubmitVerifyCode}

            isLoadingVerify={isPendingPostUserLogin}
            isLoadingResend={isPendingPostUserResend}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
