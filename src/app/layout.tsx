import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import {
    generateOrganizationSchema,
    generateWebSiteSchema,
    generateMedicalWebPageSchema,
    generateSoftwareApplicationSchema,
} from "@/lib/structured-data";

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
        { color: "#20B2C4", media: "(prefers-color-scheme: light)" },
        { color: "#20B2C4", media: "(prefers-color-scheme: dark)" },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

const siteConfig = {
    name: "GRCP Argentina | Asistente Virtual de Primeros Auxilios",
    shortName: "GRCP IA",
    description: "Asistente virtual inteligente de GRCP Argentina. Obtén información orientativa sobre primeros auxilios, RCP, capacitaciones y servicios de emergencia. Aprende cómo actuar ante situaciones críticas.",
    url: "https://grcp-arg.website",
    ogImage: "/og-image.png",
    keywords: [
        "GRCP Argentina",
        "primeros auxilios",
        "RCP",
        "asistente virtual",
        "emergencias médicas",
        "capacitación",
        "desfibrilador",
        "DEA",
        "cursos primeros auxilios",
        "atención de emergencias",
        "salud",
        "seguridad",
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [
        { name: "GRCP Argentina" },
        { name: "Julian Peruzzi", url: "https://devanthos.com" },
    ],
    creator: "Julian Peruzzi - Devanthos Agency",
    publisher: "GRCP Argentina",
    
    // Open Graph
    openGraph: {
        type: "website",
        locale: "es_AR",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.shortName,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: "GRCP Argentina - Asistente Virtual de Primeros Auxilios",
                type: "image/png",
            },
        ],
    },
    
    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: "@GRCPArgentina",
    },
    
    // Icons
    icons: {
        icon: [
            { url: "/favicon.svg", sizes: "any" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: "/GRCP LOGO - COLORES E ICONOS 2024 .png",
        shortcut: "/favicon.svg",
    },
    
    // Manifest
    manifest: "/manifest.json",
    
    // Additional
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    
    // Verification
    verification: {
        // google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
    },
    
    category: "health",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Structured Data para SEO
    const jsonLd = {
        organization: generateOrganizationSchema(),
        website: generateWebSiteSchema(),
        medicalPage: generateMedicalWebPageSchema(),
        software: generateSoftwareApplicationSchema(),
    };

    return (
        <html lang="es">
            <head>
                {/* Structured Data (JSON-LD) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd.organization),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd.website),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd.medicalPage),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd.software),
                    }}
                />
            </head>
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
