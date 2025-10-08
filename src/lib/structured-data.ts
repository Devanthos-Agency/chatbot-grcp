export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "GRCP Argentina",
        alternateName: "Grupo de Reanimación Cardiopulmonar Argentina",
        url: "https://grcp-arg.website",
        logo: "https://grcp-arg.website/GRCP LOGO - COLORES E ICONOS 2024 .png",
        description:
            "Organización especializada en primeros auxilios, RCP y capacitación en emergencias médicas en Argentina",
        address: {
            "@type": "PostalAddress",
            addressCountry: "AR",
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["Spanish"],
        },
        sameAs: [
            // Agregar redes sociales de GRCP Argentina
            // "https://www.facebook.com/GRCPArgentina",
            // "https://www.instagram.com/GRCPArgentina",
            // "https://www.linkedin.com/company/grcp-argentina",
        ],
    };
}

export function generateWebSiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "GRCP Argentina - Asistente Virtual",
        alternateName: "GRCP IA",
        url: "https://grcp-arg.website",
        description:
            "Asistente virtual inteligente para consultas sobre primeros auxilios, RCP, capacitaciones y servicios de emergencia en Argentina",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: "https://grcp-arg.website/?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function generateMedicalWebPageSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: "GRCP Argentina - Información de Primeros Auxilios",
        description:
            "Información orientativa sobre primeros auxilios, RCP y procedimientos de emergencia médica",
        about: {
            "@type": "MedicalEntity",
            name: "Primeros Auxilios y RCP",
        },
        reviewedBy: {
            "@type": "Organization",
            name: "GRCP Argentina",
        },
        lastReviewed: new Date().toISOString().split("T")[0],
        specialty: "Emergency Medicine",
        audience: {
            "@type": "PeopleAudience",
            audienceType: "General Public",
        },
    };
}

export function generateSoftwareApplicationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "GRCP Argentina - Asistente Virtual",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web Browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "ARS",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "100",
        },
        description:
            "Asistente virtual con inteligencia artificial para consultas sobre primeros auxilios, RCP y emergencias médicas",
        featureList: [
            "Información sobre primeros auxilios",
            "Guías de RCP",
            "Orientación en emergencias",
            "Información sobre capacitaciones",
            "Consultas 24/7",
        ],
        screenshot: "https://grcp-arg.website/og-image.png",
    };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}
