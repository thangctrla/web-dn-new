import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tra cứu Doanh nghiệp Việt Nam | Cổng thông tin & Mã số thuế Doanh nghiệp',
  description: 'Hệ thống tra cứu thông tin doanh nghiệp, mã số thuế, người đại diện, ngành nghề kinh doanh và trạng thái hoạt động trên toàn quốc.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
