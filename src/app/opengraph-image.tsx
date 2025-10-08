import { ImageResponse } from "next/og";

// Configuración de la imagen
export const alt = "GRCP Argentina - Asistente Virtual de Primeros Auxilios";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

// Generación de la imagen OG
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffffff",
                    backgroundImage:
                        "radial-gradient(circle at 25% 25%, rgba(32, 178, 196, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(12, 116, 137, 0.1) 0%, transparent 50%)",
                }}
            >
                {/* Contenedor principal */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "60px",
                        textAlign: "center",
                    }}
                >
                    {/* Título principal */}
                    <div
                        style={{
                            fontSize: "80px",
                            fontWeight: "bold",
                            color: "#20B2C4",
                            marginBottom: "20px",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        GRCP ARGENTINA
                    </div>

                    {/* Subtítulo */}
                    <div
                        style={{
                            fontSize: "48px",
                            fontWeight: "600",
                            color: "#1a1a1a",
                            marginBottom: "40px",
                            maxWidth: "900px",
                        }}
                    >
                        Asistente Virtual de Primeros Auxilios
                    </div>

                    {/* Iconos/Badges */}
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            marginBottom: "40px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "12px 24px",
                                backgroundColor: "rgba(32, 178, 196, 0.1)",
                                borderRadius: "999px",
                                border: "2px solid #20B2C4",
                                color: "#0C7489",
                                fontSize: "32px",
                                fontWeight: "600",
                            }}
                        >
                            💙 RCP
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "12px 24px",
                                backgroundColor: "rgba(32, 178, 196, 0.1)",
                                borderRadius: "999px",
                                border: "2px solid #20B2C4",
                                color: "#0C7489",
                                fontSize: "32px",
                                fontWeight: "600",
                            }}
                        >
                            🚑 Emergencias
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "12px 24px",
                                backgroundColor: "rgba(32, 178, 196, 0.1)",
                                borderRadius: "999px",
                                border: "2px solid #20B2C4",
                                color: "#0C7489",
                                fontSize: "32px",
                                fontWeight: "600",
                            }}
                        >
                            ⚡ 24/7
                        </div>
                    </div>

                    {/* Texto inferior */}
                    <div
                        style={{
                            fontSize: "28px",
                            color: "#666666",
                            fontWeight: "400",
                        }}
                    >
                        Información orientativa • Capacitaciones • Recursos
                    </div>

                    {/* Badge de IA */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "40px",
                            right: "40px",
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 20px",
                            backgroundColor: "#20B2C4",
                            borderRadius: "8px",
                            color: "white",
                            fontSize: "24px",
                            fontWeight: "600",
                        }}
                    >
                        🤖 IA Asistente
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
