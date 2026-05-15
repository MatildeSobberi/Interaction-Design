import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        {/* Adobe Fonts Project */}
        <link rel="stylesheet" href="https://use.typekit.net/fnc5rgs.css" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#000' }}>
        {children}
      </body>
    </html>
  );
}