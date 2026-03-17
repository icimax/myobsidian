import "./globals.css";
import fs from 'fs';
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getNoteData } from '@/lib/notes';


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Navbar note={await getNoteData("max")} />
            <main style={{ flex: 1 }}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
