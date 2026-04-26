import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TalentAxiss – AI Recruitment Platform for Kerala Agencies",
    template: "%s | TalentAxiss",
  },
  description:
    "Transform your consultancy into an AI recruitment machine. TalentAxiss is the modern CRM built for Kerala recruitment agencies.",
  keywords: ["recruitment", "consultancy", "Kerala", "jobs", "AI", "CRM", "candidates"],
  authors: [{ name: "TalentAxiss" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "TalentAxiss – AI Recruitment Platform",
    description: "The future of recruitment for Kerala consultancies.",
    siteName: "TalentAxiss",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalentAxiss – AI Recruitment Platform",
    description: "The future of recruitment for Kerala consultancies.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster
              position="top-right"
              expand={false}
              richColors
              theme="dark"
              toastOptions={{
                style: {
                  background: "hsl(240 10% 8%)",
                  border: "1px solid hsl(240 3.7% 20%)",
                  color: "hsl(0 0% 98%)",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
