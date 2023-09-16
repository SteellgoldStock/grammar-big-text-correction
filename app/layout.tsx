import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bulk Correct',
  description: 'Correct a BIG document in bulk.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={cn(inter.className, 'h-full')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
