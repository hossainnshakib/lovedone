import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A collection of moments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23F7F4EE' width='100' height='100' rx='20'/><circle cx='50' cy='50' r='30' fill='none' stroke='%233B5D50' stroke-width='4'/><circle cx='50' cy='50' r='15' fill='%233B5D50'/></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
