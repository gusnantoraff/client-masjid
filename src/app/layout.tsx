"use client";

import { ReactNode, useEffect } from "react";
import "@/css/globals.css";
import 'aos/dist/aos.css';
import AOS from "aos";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  useEffect(() => {
    AOS.init({
      duration: 1200, 
      easing: "ease-in-out",
      once: true, 
    });
  }, []);

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
