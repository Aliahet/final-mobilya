'use client';

import { ReactNode } from 'react';
import { LangProvider } from '@/lib/i18n';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </LangProvider>
  );
}
