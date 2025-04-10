import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Imobiliária - Admin',
  description: 'Sistema administrativo para imobiliária',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold">Imobiliária</a>
            <div className="space-x-4">
              <a href="/" className="hover:text-blue-200">Imóveis</a>
              <a href="/cadastro" className="hover:text-blue-200">Cadastrar</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
} 