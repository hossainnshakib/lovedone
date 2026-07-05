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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23100C0A' width='100' height='100' rx='20'/><circle cx='50' cy='40' r='20' fill='%23B23A2E' opacity='0.8'/><rect fill='%23EDE6D5' x='25' y='55' width='50' height='35' rx='4'/></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
