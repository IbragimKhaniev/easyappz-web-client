
import { memo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from '@/features/auth/model/types';
import { UI_ELEMENTS } from '@/shared/config/ui';
import { cn } from '@/shared/lib/utils/common';

interface ProfileInfoProps {
  isLoading: boolean;
  user: User | null;
}

export const ProfileInfo = memo(({ isLoading, user }: ProfileInfoProps) => {
  return (
    <div className={cn(UI_ELEMENTS.GLASS_EFFECT, 'space-y-4')}>
      {isLoading ? (
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
            <p className="text-white text-lg">{user?.username}</p>
          </div>
        </>
      )}
    </div>
  );
});

ProfileInfo.displayName = 'ProfileInfo';
