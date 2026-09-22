import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'galmuri/dist/galmuri.css';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '리라즈의 공연 준비 대작전',
  description: '리라즈와 함께 팬 이벤트를 완성하는 모바일 픽셀 투표 퀘스트',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
