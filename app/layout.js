import './globals.css';
import Nav from './components/Nav';

export const metadata = {
  title: 'Personal Project Sandbox',
  description: 'A simple, visual, and flexible system to capture and track personal project ideas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
