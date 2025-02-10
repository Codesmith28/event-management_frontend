import { ToastProvider } from "@/components/ui/use-toast";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CldUploadWidget } from 'next-cloudinary';
import { cloudinaryConfig } from '@/config/cloudinary';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          src={`https://widget.cloudinary.com/v2.0/global/all.js`}
          type="text/javascript"
        />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
