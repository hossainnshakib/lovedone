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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23202A38' width='100' height='100' rx='20'/><rect fill='%23FBF6EC' x='20' y='15' width='60' height='70' rx='4'/><rect fill='%23D98C93' x='35' y='8' width='30' height='12' rx='2' opacity='0.8'/></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
