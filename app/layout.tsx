import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diary of Experience',
  description: 'A travel experience project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        {/* Il tuo link Adobe Fonts */}
        <link rel="stylesheet" href="https://use.typekit.net/fnc5rgs.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}