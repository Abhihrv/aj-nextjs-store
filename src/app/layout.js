import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "AJ NextJs Store",
  description: "Testing NextJs Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="flex min-h-full flex-col bg-white"
      >
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
