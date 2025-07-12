import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "TeleBridge - Connecting Patients to Specialized Healthcare",
  description: "TeleBridge connects patients in Rwanda and underserved regions with expert specialists worldwide, eliminating the need for international travel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="w-full">
          {children}
        </div>
  );
}
