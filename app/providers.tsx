'use client';

import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

export const Providers = (props: PropsWithChildren) => {
  return (
    <>
      <Toaster />
      {props.children}
    </>
  );
};
