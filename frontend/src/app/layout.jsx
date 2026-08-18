import './globals.css';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

export const metadata = {
  title: 'KeenKeeper',
  description: 'Your personal shelf of meaningful connections.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className="flex flex-col min-h-screen">
        <NavBar />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
