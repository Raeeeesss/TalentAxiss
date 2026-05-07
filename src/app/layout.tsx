import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

/* ── Space Grotesk — distinctive geometric sans
   Feels premium, human, decidedly non-generic.
   Weights 300–700 covers all UI needs.
──────────────────────────────────────────────── */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sg",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TalentAxiss – Kerala's #1 AI Recruitment CRM for Consultancies",
    template: "%s | TalentAxiss",
  },
  description:
    "Transform your consultancy into an AI recruitment machine. Manage candidates, AI matching, pipeline, follow-ups and analytics — all in one powerful platform.",
  keywords: ["recruitment", "consultancy", "Kerala", "jobs", "AI", "CRM", "candidates", "Gulf placement"],
  authors: [{ name: "TalentAxiss" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "TalentAxiss – Kerala's #1 AI Recruitment CRM",
    description: "Replace WhatsApp chaos and Excel sheets with one AI-powered recruitment platform.",
    siteName: "TalentAxiss",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalentAxiss – AI Recruitment Platform for Kerala Agencies",
    description: "Replace WhatsApp chaos and Excel sheets with one AI-powered recruitment platform.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={spaceGrotesk.variable}>
      <body className="font-sg antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
            forcedTheme="light"
          >
            {children}
            <Toaster
              position="top-right"
              richColors
              theme="light"
              toastOptions={{
                style: {
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  boxShadow: "0 8px 30px rgba(0,0,0,.08)",
                  fontFamily: "var(--font-sg), system-ui, sans-serif",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
