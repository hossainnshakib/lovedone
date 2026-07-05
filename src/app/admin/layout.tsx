import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Photo Reveal',
  description: 'Admin panel for Photo Reveal App',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23100D0A' width='100' height='100' rx='20'/><circle cx='50' cy='50' r='30' fill='none' stroke='%23E3A34C' stroke-width='4'/><circle cx='50' cy='50' r='15' fill='%23E3A34C'/></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
