import type { Metadata } from "next";
import { Roboto } from "next/font/google"; // Importiamo Roboto
import "./globals.css";

// Configuriamo le varianti che ci servono: Regular (400) e Bold (700)
const roboto = Roboto({ 
  subsets: ["latin"], 
  weight: ['400', '700'],
  variable: '--font-roboto', // Creiamo una variabile CSS
});

export const metadata: Metadata = {
  title: "A.I. Curiosity Map",
  description: "What if A.I. started with a question?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      {/* Applichiamo la variabile del font al body */}
      <body className={`${roboto.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}