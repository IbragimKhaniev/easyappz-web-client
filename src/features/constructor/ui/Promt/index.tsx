import { GetApplicationsApplicationIdMessages200ItemPromtsItem } from '@/api/core';
import { Typing } from '@/components/Typing';
import React, { useEffect, useState, memo } from 'react';

interface PromtProps {
  data: GetApplicationsApplicationIdMessages200ItemPromtsItem;

  typing?: boolean;
}

export const Promt = memo(({ data, typing }: PromtProps) => {
  return (
    <div className="mt-1 rounded text-gray-100 text-left">
      {data.result && typing ? <Typing content={data.result} /> : <div>{data.result}</div>}
    </div>
  );
});

Promt.displayName = 'Promt';