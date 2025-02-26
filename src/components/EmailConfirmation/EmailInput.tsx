
import { Send, Check, Loader2 } from "lucide-react";
import { memo, KeyboardEvent, useCallback } from "react";

interface EmailInputProps {
  email: string;

  onChange: (value: string) => void;
  onSubmit: () => Promise<void>;

  isSubmitting: boolean;
  isSuccess: boolean;
}

export const EmailInput = memo(({
  email,

  onChange,
  onSubmit,

  isSubmitting,
  isSuccess
}: EmailInputProps) => {  
  const isValidEmail = useCallback((email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValidEmail(email) && !isSubmitting) {
      e.preventDefault();
      onSubmit();
    }
  }, [email, isSubmitting, isValidEmail, onSubmit]);

  return (
    <div className="relative">
      <input 
        type="email" 
        value={email} 
        onChange={e => onChange(e.target.value)} 
        onKeyDown={handleKeyDown}
        placeholder="Введите email" 
        className={`glass-effect rounded-full p-3 pl-4 pr-12 w-full text-gray-400 bg-transparent focus:outline-none ${!isValidEmail(email) && email.length > 0 ? 'border-red-500' : ''}`} 
      />
      <button 
        onClick={onSubmit} 
        disabled={isSubmitting || !isValidEmail(email)} 
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <span className={`bg-[#4FD1C5] p-1.5 rounded-full flex items-center justify-center w-8 h-8 transition-all duration-300 overflow-hidden ${!isValidEmail(email) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#45b8ae]'}`}>
          <div className={`transition-all duration-300 transform ${isSubmitting || isSuccess ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} absolute`}>
            <Send className="w-4 h-4 text-white opacity-80 rotate-[1080deg]" />
          </div>
          <div className={`transition-all duration-300 transform ${isSubmitting && !isSuccess ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} absolute`}>
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
          <div className={`transition-all duration-300 transform ${isSuccess ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} absolute`}>
            <Check className="w-4 h-4 text-white" />
          </div>
        </span>
      </button>
    </div>
  );
});

EmailInput.displayName = 'EmailInput';
