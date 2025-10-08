import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    themeColor: [
        { color: "#4c5dab", media: "(prefers-color-scheme: light)" },
        { color: "#4c5dab", media: "(prefers-color-scheme: dark)" },
    ],
};
const siteConfig = {
    name: "GRCP IA | Asistente de GRCP Argentina",
    description: "Asistente virtual para consultas GRCP Argentina",
};

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ["Devanthos", "Devi", "Asistente Virtual"],
    icons: {
        icon: "/GRCP LOGO - COLORES E ICONOS 2024 .png",
        apple: "/GRCP LOGO - COLORES E ICONOS 2024 .png",
        shortcut: "y/GRCP LOGO - COLORES E ICONOS 2024 .png",
    },
    // manifest: "/manifest.json",
    creator: "Julian Peruzzi",
    publisher: "Julian Peruzzi",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh dark w-full relative`}
            >
                <div
                    className="absolute inset-0 z-0 "
                    style={{
                        background: `
                            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
                            radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
                            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
                            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%)
                            `,
                    }}
                />

                {children}
            </body>
        </html>
    );
}
