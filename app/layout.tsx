import Link from 'next/link';
import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

const TopNavigation = () => {
  return (
    <nav className="flex items-center  bg-white p-3 flex-wrap">
      <Link href="/" className="p-2 mr-4 inline-flex items-center">
        <span className="text-xl text-gray-800 uppercase tracking-wide">Transaction Builder</span>
      </Link>
    </nav>
  );
};

const Footer = () => (
  <footer className="text-gray-600 body-font mt-auto">
    <div className="container px-5 py-8 flex items-center sm:flex-row flex-col">
      <Link
        href="/"
        className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
        <span className="ml-3 text-xl">Transaction Builder</span>
      </Link>
      <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
        © {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="flex h-screen w-screen flex-col">
            <TopNavigation />
            <div>{children}</div>
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
