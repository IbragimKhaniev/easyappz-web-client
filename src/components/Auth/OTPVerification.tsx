
import { useState, useCallback, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  email: string,

  onResendCode: () => Promise<void>;
  onBack: () => void;
  onSubmit: (otp: string) => Promise<void>;

  isLoadingVerify: boolean;
  isLoadingResend: boolean;
}

export const OTPVerification = ({
  email,

  onResendCode,
  onBack,
  onSubmit,

  isLoadingVerify,
  isLoadingResend,
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');

  const isValidOTP = useCallback((code: string) => {
    return /^\d{6}$/.test(code);
  }, []);

  const handleVerify = useCallback(async () => {
    if (!isValidOTP(otp)) return;
    
    onSubmit(otp);
  }, [isValidOTP, onSubmit, otp]);

  const handleResend = useCallback(async () => {
    if (isLoadingResend) return;
    
    onResendCode();
  }, [isLoadingResend, onResendCode]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValidOTP(otp) && !isLoadingVerify) {
      e.preventDefault();
      handleVerify();
    }
  }, [handleVerify, isLoadingVerify, isValidOTP, otp]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="relative text-center space-y-3">
        <button
          onClick={onBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-white">Введите код подтверждения</h2>
        <p className="text-gray-400 text-sm">
          Код-верификации отправлен на почту {email}
        </p>
      </div>

      <input 
        type="text"
        inputMode="numeric"
        value={otp}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter code"
        className={`glass-effect rounded-3xl p-3 pl-4 w-full text-gray-400 bg-transparent focus:outline-none text-center ${otp.length > 0 && !isValidOTP(otp) ? 'border-red-500' : ''}`}
        maxLength={6}
        disabled={isLoadingVerify}
      />

      <button 
        onClick={handleVerify} 
        disabled={!isValidOTP(otp) || isLoadingVerify}
        className={`w-full bg-[#4FD1C5] hover:bg-[#45b8ae] text-white font-medium p-3 rounded-3xl transition-colors duration-200 flex items-center justify-center gap-2 ${!isValidOTP(otp) || isLoadingVerify ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoadingVerify ? (
          <>
            <Loader2 size={18} className="animate-spin text-white" />
            Проверяется...
          </>
        ) : (
          'Готово'
        )}
      </button>

      <button 
        onClick={handleResend}
        disabled={isLoadingResend}
        className="w-full text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center justify-center gap-2"
      >
        {isLoadingResend ? (
          <>
            <Loader2 size={14} className="animate-spin text-white" />
            Код отправляется...
          </>
        ) : (
          'Отправить код еще раз'
        )}
      </button>
    </div>
  );
};
