
import { cn } from "@/lib/utils";

interface LoadingCircleProps {
  progress: number;
  className?: string;
}

export const LoadingCircle = ({ progress, className }: LoadingCircleProps) => {
  const circumference = 2 * Math.PI * 45; // r = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn(
      "loading-circle bg-white/90 backdrop-blur-md rounded-full p-8",
      "shadow-[0_0_50px_rgba(0,0,0,0.1)] border border-white/50",
      className
    )}>
      <svg
        className="loading-circle-svg"
        width="160"
        height="160"
        viewBox="0 0 160 160"
      >
        <circle
          className="text-gray-100"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="60"
          cx="80"
          cy="80"
        />
        <circle
          className="text-primary transition-all duration-300 ease-in-out"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="60"
          cx="80"
          cy="80"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-2xl font-semibold text-primary">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};
