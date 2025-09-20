"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { Globe, ArrowRight, Settings } from "lucide-react";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEVANTHOS_SYSTEM_PROMPT } from "@/lib/devanthos-prompt";
import {
    Message,
    MessageContent,
    MessageAvatar,
} from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import type { UIMessage } from "@ai-sdk/react";
import { cn } from "@/lib/utils";

import { Marquee } from "@/components/ui/marquee";
import { AuroraText } from "../ui/aurora-text";

// Sugerencias de ejemplo para el marquee
const suggestions = [
    "¿Cómo puedo aprender programación desde cero?",
    "Explícame las últimas tendencias en inteligencia artificial",
    "¿Cuál es la mejor manera de crear una página web responsive?",
    "Ayúdame a entender los conceptos básicos de React",
    "¿Qué son las APIs y cómo funcionan?",
    "Explícame qué es la computación en la nube",
    "¿Cómo optimizar el rendimiento de una aplicación web?",
    "¿Cuáles son las mejores prácticas en desarrollo frontend?",
    "Ayúdame a crear un plan de carrera en tecnología",
    "¿Qué es el machine learning y cómo empezar?",
    "Explícame los fundamentos de TypeScript",
    "¿Cómo implementar autenticación segura en aplicaciones?",
];

// Opciones de intencionalidad del chatbot
const CHAT_INTENTS = [
    {
        value: "customer-service",
        label: "Atención al Cliente",
        description: "Asistente especializado en soporte y atención al cliente",
    },
    {
        value: "sales",
        label: "Ventas y Comercial",
        description: "Asistente enfocado en generar leads y cerrar ventas",
    },
    {
        value: "technical-support",
        label: "Soporte Técnico",
        description:
            "Asistente para resolver problemas técnicos y consultas especializadas",
    },
    {
        value: "educational",
        label: "Educativo",
        description: "Asistente para enseñar y explicar conceptos",
    },
    {
        value: "consulting",
        label: "Consultoría",
        description: "Asistente consultor para brindar asesoría especializada",
    },
    {
        value: "general",
        label: "Propósito General",
        description: "Asistente versátil para múltiples propósitos",
    },
];

// Función para generar el prompt dinámico
const generateDynamicPrompt = (
    assistantName: string,
    companyInfo: string,
    chatIntent: string,
    customPrompt: string,
    useCustomConfig: boolean
): string => {
    if (
        !useCustomConfig ||
        (!assistantName && !companyInfo && !chatIntent && !customPrompt)
    ) {
        return DEVANTHOS_SYSTEM_PROMPT;
    }

    const selectedIntent = CHAT_INTENTS.find(
        (intent) => intent.value === chatIntent
    );

    let dynamicPrompt = `Eres ${assistantName || "un asistente inteligente"}`;

    if (companyInfo) {
        dynamicPrompt += ` de ${companyInfo}`;
    }

    dynamicPrompt += ".\n\n";

    if (selectedIntent) {
        switch (chatIntent) {
            case "customer-service":
                dynamicPrompt +=
                    "Tu función principal es brindar excelente atención al cliente, resolver consultas, gestionar quejas y asegurar la satisfacción del usuario. Sé empático, profesional y orientado a soluciones.";
                break;
            case "sales":
                dynamicPrompt +=
                    "Tu objetivo es ayudar a generar ventas, calificar leads, presentar productos/servicios de manera atractiva y guiar a los usuarios hacia la conversión. Sé persuasivo pero no agresivo.";
                break;
            case "technical-support":
                dynamicPrompt +=
                    "Especialízate en resolver problemas técnicos, proporcionar documentación, guías paso a paso y soluciones precisas. Sé detallado y técnico cuando sea necesario.";
                break;
            case "educational":
                dynamicPrompt +=
                    "Tu función es enseñar, explicar conceptos complejos de manera simple, proporcionar ejemplos prácticos y fomentar el aprendizaje. Sé didáctico y paciente.";
                break;
            case "consulting":
                dynamicPrompt +=
                    "Actúa como consultor experto, brinda asesoría estratégica, analiza situaciones y proporciona recomendaciones fundamentadas. Sé analítico y profesional.";
                break;
            case "general":
            default:
                dynamicPrompt +=
                    "Eres un asistente versátil capaz de ayudar en múltiples áreas. Adapta tu estilo de respuesta según la consulta del usuario.";
                break;
        }
    }

    if (customPrompt) {
        dynamicPrompt += `\n\nInstrucciones adicionales:\n${customPrompt}`;
    }

    dynamicPrompt +=
        "\n\nSiempre responde de manera clara, profesional y útil.";

    return dynamicPrompt;
};

// Componente de input con animación
function AnimatedInput({
    className,
    placeholder,
    onChange,
    onSubmit,
    value,
    setValue,
}: {
    className?: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    value: string;
    setValue: (value: string) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const newDataRef = useRef<
        {
            x: number;
            y: number;
            r: number;
            color: string;
        }[]
    >([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const [animating, setAnimating] = useState(false);

    const draw = useCallback(() => {
        if (!inputRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 800;
        ctx.clearRect(0, 0, 800, 800);
        const computedStyles = getComputedStyle(inputRef.current);

        const fontSize = parseFloat(
            computedStyles.getPropertyValue("font-size")
        );
        ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
        ctx.fillStyle = "#FFF";
        ctx.fillText(value, 16, 40);

        const imageData = ctx.getImageData(0, 0, 800, 800);
        const pixelData = imageData.data;
        const newData: {
            x: number;
            y: number;
            color: number[];
        }[] = [];

        for (let t = 0; t < 800; t++) {
            const i = 4 * t * 800;
            for (let n = 0; n < 800; n++) {
                const e = i + 4 * n;
                if (
                    pixelData[e] !== 0 &&
                    pixelData[e + 1] !== 0 &&
                    pixelData[e + 2] !== 0
                ) {
                    newData.push({
                        x: n,
                        y: t,
                        color: [
                            pixelData[e],
                            pixelData[e + 1],
                            pixelData[e + 2],
                            pixelData[e + 3],
                        ],
                    });
                }
            }
        }

        newDataRef.current = newData.map(({ x, y, color }) => ({
            x,
            y,
            r: 1,
            color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
        }));
    }, [value]);

    useEffect(() => {
        draw();
    }, [value, draw]);

    const animate = (start: number) => {
        const animateFrame = (pos: number = 0) => {
            requestAnimationFrame(() => {
                const newArr = [];
                for (let i = 0; i < newDataRef.current.length; i++) {
                    const current = newDataRef.current[i];
                    if (current.x < pos) {
                        newArr.push(current);
                    } else {
                        if (current.r <= 0) {
                            current.r = 0;
                            continue;
                        }
                        current.x += Math.random() > 0.5 ? 1 : -1;
                        current.y += Math.random() > 0.5 ? 1 : -1;
                        current.r -= 0.05 * Math.random();
                        newArr.push(current);
                    }
                }
                newDataRef.current = newArr;
                const ctx = canvasRef.current?.getContext("2d");
                if (ctx) {
                    ctx.clearRect(pos, 0, 800, 800);
                    newDataRef.current.forEach((t) => {
                        const { x: n, y: i, r: s, color: color } = t;
                        if (n > pos) {
                            ctx.beginPath();
                            ctx.rect(n, i, s, s);
                            ctx.fillStyle = color;
                            ctx.strokeStyle = color;
                            ctx.stroke();
                        }
                    });
                }
                if (newDataRef.current.length > 0) {
                    animateFrame(pos - 8);
                } else {
                    setValue("");
                    setAnimating(false);
                }
            });
        };
        animateFrame(start);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !animating) {
            vanishAndSubmit();
        }
    };

    const vanishAndSubmit = () => {
        setAnimating(true);
        draw();

        const value = inputRef.current?.value || "";
        if (value && inputRef.current) {
            const maxX = newDataRef.current.reduce(
                (prev, current) => (current.x > prev ? current.x : prev),
                0
            );
            animate(maxX);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        vanishAndSubmit();
        onSubmit(e);
    };

    return (
        <form
            className={cn(
                "relative mx-auto h-12 w-full max-w-xl overflow-hidden bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 dark:bg-zinc-800 rounded-2xl",
                value && "bg-gray-50 dark:bg-zinc-700",
                className
            )}
            onSubmit={handleSubmit}
        >
            <canvas
                className={cn(
                    "pointer-events-none absolute -left-2 top-2 origin-top-left scale-50 transform pr-20 text-base invert filter dark:invert-0",
                    !animating ? "opacity-0" : "opacity-100"
                )}
                ref={canvasRef}
            />
            <input
                placeholder={placeholder}
                onChange={(e) => {
                    if (!animating) {
                        setValue(e.target.value);
                        onChange(e);
                    }
                }}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                value={value}
                type="text"
                className={cn(
                    "relative z-50 h-full w-full border-none bg-transparent px-4 text-sm tracking-tight text-black focus:outline-none focus:ring-0 dark:text-white",
                    animating && "text-transparent dark:text-transparent"
                )}
            />

            <button
                disabled={!value}
                type="submit"
                className="absolute right-2 top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black transition duration-200 disabled:bg-gray-100 dark:bg-zinc-900 dark:disabled:bg-zinc-800"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: value ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ArrowRight className="h-4 w-4 text-white" />
                </motion.div>
            </button>
        </form>
    );
}

export default function Chatbot() {
    const [value, setValue] = useState("");
    const [searchEnabled, setSearchEnabled] = useState(true);
    const [configOpen, setConfigOpen] = useState(false);

    // Estados de configuración del chatbot
    const [assistantName, setAssistantName] = useState("");
    const [companyInfo, setCompanyInfo] = useState("");
    const [chatIntent, setChatIntent] = useState("");
    const [customPrompt, setCustomPrompt] = useState("");
    const [useCustomConfig, setUseCustomConfig] = useState(false);

    // Generar el prompt actual basado en la configuración
    const getCurrentPrompt = () => {
        return generateDynamicPrompt(
            assistantName,
            companyInfo,
            chatIntent,
            customPrompt,
            useCustomConfig
        );
    };

    const { messages, sendMessage, status, error, stop } = useChat({
        onError: (error) => {
            console.error("Error en el chat:", error);
        },
        onFinish: ({ message, messages }) => {
            console.log("Mensaje completado:", message);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!value.trim()) return;

        sendMessage(
            {
                text: value,
            },
            {
                body: {
                    systemPrompt: getCurrentPrompt(),
                },
            }
        );
        setValue("");
    };

    const selectSuggestion = (suggestion: string) => {
        setValue(suggestion);
    };

    const clearConversation = () => {
        window.location.reload(); // Forma simple de limpiar la conversación
    };

    // Manejar guardado de configuración
    const handleSaveConfig = () => {
        // Guardar en localStorage para persistencia
        const config = {
            assistantName,
            companyInfo,
            chatIntent,
            customPrompt,
            useCustomConfig,
        };
        localStorage.setItem("chatbot-config", JSON.stringify(config));
        setConfigOpen(false);

        // Si hay mensajes, reiniciar conversación para aplicar nueva configuración
        if (messages.length > 0) {
            clearConversation();
        }
    };

    // Cargar configuración guardada al inicializar
    React.useEffect(() => {
        const savedConfig = localStorage.getItem("chatbot-config");
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                setAssistantName(config.assistantName || "");
                setCompanyInfo(config.companyInfo || "");
                setChatIntent(config.chatIntent || "");
                setCustomPrompt(config.customPrompt || "");
                setUseCustomConfig(config.useCustomConfig || false);
            } catch (error) {
                console.error("Error loading saved config:", error);
            }
        }
    }, []);

    // Vista unificada que mantiene la misma UI siempre
    return (
        <section className="overflow-hidden min-h-screen">
            <div className="container py-4 px-2 mx-auto flex h-screen w-full flex-col items-center justify-center">
                <div className="flex h-full w-full max-w-4xl flex-col items-center justify-center gap-4">
                    {/* Header/Title - se reduce cuando hay mensajes */}
                    <motion.div
                        className={cn(
                            "text-center transition-all duration-500",
                            messages.length > 0 ? "my-4" : "my-[20vh]"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1
                            className={cn(
                                "font-semibold tracking-tighter transition-all duration-500",
                                messages.length > 0
                                    ? "text-2xl mb-2"
                                    : "text-5xl mb-8"
                            )}
                        >
                            <AuroraText
                                colors={[
                                    "#ff6449",
                                    "#ff6449",
                                    "#6248fe",
                                    "#6248fe",
                                ]}
                                className={cn(
                                    "relative ",
                                    messages.length > 0 ? "left-1/4" : ""
                                )}
                            >
                                {messages.length > 0
                                    ? "ChatBot Devanthos"
                                    : "¿En qué te puedo ayudar hoy?"}
                            </AuroraText>
                            <AuroraText
                                colors={[
                                    "#ff6449",
                                    "#ff6449",
                                    "#6248fe",
                                    "#6248fe",
                                ]}
                                className={cn(
                                    "absolute -z-10",
                                    messages.length > 0
                                        ? "top-0 -left-1/4 blur-lg"
                                        : "-top-24 blur-xl md:-top-12"
                                )}
                            >
                                {messages.length > 0
                                    ? "ChatBot Devanthos"
                                    : "¿En qué te puedo ayudar hoy?"}
                            </AuroraText>
                        </h1>
                        {messages.length > 0 && (
                            <motion.p
                                className="text-sm text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Powered by Google Gemini 2.5 Flash
                            </motion.p>
                        )}
                    </motion.div>

                    {/* Área de mensajes - aparece cuando hay conversación */}
                    {messages.length > 0 && (
                        <motion.div
                            className="flex-1 w-full max-w-4xl overflow-hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="bg-muted/20 backdrop-blur-sm rounded-2xl border border-border/50 h-full overflow-hidden">
                                <Conversation className="h-full">
                                    <ConversationContent className="p-6">
                                        <div className="space-y-6">
                                            {messages.map(
                                                (message: UIMessage) => (
                                                    <motion.div
                                                        key={message.id}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                    >
                                                        <Message
                                                            from={message.role}
                                                        >
                                                            <MessageAvatar
                                                                src={
                                                                    message.role ===
                                                                    "user"
                                                                        ? "/user-avatar.svg"
                                                                        : "/bot-avatar.svg"
                                                                }
                                                                name={
                                                                    message.role ===
                                                                    "user"
                                                                        ? "Usuario"
                                                                        : "Devanthos Bot"
                                                                }
                                                            />
                                                            <MessageContent variant="flat">
                                                                {message.parts.map(
                                                                    (
                                                                        part,
                                                                        index
                                                                    ) => {
                                                                        if (
                                                                            part.type ===
                                                                            "text"
                                                                        ) {
                                                                            return (
                                                                                <Response
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="prose prose-sm max-w-none dark:prose-invert"
                                                                                >
                                                                                    {
                                                                                        part.text
                                                                                    }
                                                                                </Response>
                                                                            );
                                                                        }
                                                                        if (
                                                                            part.type ===
                                                                                "file" &&
                                                                            part.mediaType?.startsWith(
                                                                                "image/"
                                                                            )
                                                                        ) {
                                                                            return (
                                                                                <img
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    src={
                                                                                        part.url
                                                                                    }
                                                                                    alt={
                                                                                        part.filename ||
                                                                                        "attachment"
                                                                                    }
                                                                                    className="max-w-full h-auto rounded-lg"
                                                                                />
                                                                            );
                                                                        }
                                                                        return null;
                                                                    }
                                                                )}
                                                            </MessageContent>
                                                        </Message>
                                                    </motion.div>
                                                )
                                            )}
                                            {(status === "submitted" ||
                                                status === "streaming") && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                >
                                                    <Message from="assistant">
                                                        <MessageAvatar
                                                            src="/bot-avatar.svg"
                                                            name="Devanthos Bot"
                                                        />
                                                        <MessageContent variant="flat">
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <div className="flex gap-1">
                                                                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                                                                    <div className="w-2 h-2 bg-current rounded-full animate-pulse animation-delay-150"></div>
                                                                    <div className="w-2 h-2 bg-current rounded-full animate-pulse animation-delay-300"></div>
                                                                </div>
                                                                <span className="text-sm">
                                                                    Escribiendo...
                                                                </span>
                                                                {status ===
                                                                    "streaming" && (
                                                                    <button
                                                                        onClick={
                                                                            stop
                                                                        }
                                                                        className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-300"
                                                                    >
                                                                        Detener
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </MessageContent>
                                                    </Message>
                                                </motion.div>
                                            )}
                                            {error && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800"
                                                >
                                                    <div className="text-red-600 dark:text-red-400">
                                                        ⚠️
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-red-800 dark:text-red-200 font-medium">
                                                            Error en la
                                                            conversación
                                                        </p>
                                                        <p className="text-red-600 dark:text-red-400 text-sm">
                                                            Algo salió mal. Por
                                                            favor, inténtalo de
                                                            nuevo.
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            window.location.reload()
                                                        }
                                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                    >
                                                        Reintentar
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </ConversationContent>
                                    <ConversationScrollButton />
                                </Conversation>
                            </div>
                        </motion.div>
                    )}

                    {/* Sugerencias Marquee - se oculta gradualmente cuando hay mensajes */}
                    {messages.length === 0 && (
                        <motion.div
                            className="relative w-full max-w-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <Marquee
                                vertical={true}
                                pauseOnHover={true}
                                className="text-muted-foreground relative h-32 w-full gap-3"
                            >
                                {suggestions.map((item, index) => (
                                    <p
                                        key={index}
                                        onClick={() => selectSuggestion(item)}
                                        className="hover:text-foreground cursor-pointer rounded-full px-4 text-sm tracking-tight transition-colors duration-100 ease-in-out hover:bg-muted/50"
                                    >
                                        {item}
                                    </p>
                                ))}
                            </Marquee>
                            <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b"></div>
                            <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t"></div>
                        </motion.div>
                    )}

                    {/* Input Area - siempre presente con el mismo estilo */}
                    <motion.div
                        className={cn(
                            "bg-muted/30 backdrop-blur-sm rounded-3xl w-full space-y-2 px-6 py-4 border border-border/50 transition-all duration-500",
                            messages.length > 0 ? "max-w-4xl" : "max-w-2xl"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <AnimatedInput
                            placeholder="¿Cómo te puedo ayudar hoy?"
                            className="mb-4 h-12 w-full max-w-full bg-transparent shadow-none"
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            value={value}
                            setValue={setValue}
                        />

                        <div className="flex h-10 w-full items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span
                                            onClick={() =>
                                                setSearchEnabled(!searchEnabled)
                                            }
                                            className={cn(
                                                "flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 text-sm transition-all",
                                                searchEnabled &&
                                                    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            )}
                                        >
                                            <motion.span
                                                animate={{
                                                    rotate: searchEnabled
                                                        ? 90
                                                        : 0,
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Globe className="size-4 cursor-pointer" />
                                            </motion.span>
                                            Búsqueda
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            {searchEnabled
                                                ? "Desactivar"
                                                : "Activar"}{" "}
                                            búsqueda web
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-4">
                                {messages.length > 0 && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.button
                                                onClick={clearConversation}
                                                className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{ delay: 0.5 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Nueva conversación
                                            </motion.button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Iniciar una nueva conversación
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}

                                <Dialog
                                    open={configOpen}
                                    onOpenChange={setConfigOpen}
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DialogTrigger asChild>
                                                <Settings className="size-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
                                            </DialogTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Configurar chatbot</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Configuración del Chatbot
                                            </DialogTitle>
                                            <DialogDescription>
                                                Personaliza el comportamiento
                                                del asistente para tener un demo
                                                interactivo. Si no configuras
                                                nada, se usará el prompt
                                                predeterminado de Devanthos.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-4">
                                            {/* Toggle para usar configuración personalizada */}
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="use-custom-config"
                                                    checked={useCustomConfig}
                                                    onChange={(e) =>
                                                        setUseCustomConfig(
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="rounded border-gray-300"
                                                />
                                                <Label
                                                    htmlFor="use-custom-config"
                                                    className="text-sm font-medium"
                                                >
                                                    Usar configuración
                                                    personalizada
                                                </Label>
                                            </div>

                                            {useCustomConfig && (
                                                <>
                                                    {/* Nombre del Asistente */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="assistant-name"
                                                            className="text-sm font-medium"
                                                        >
                                                            Nombre del Asistente
                                                        </Label>
                                                        <Input
                                                            id="assistant-name"
                                                            value={
                                                                assistantName
                                                            }
                                                            onChange={(e) =>
                                                                setAssistantName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Ej: María, Asistente Virtual, Bot de Soporte..."
                                                        />
                                                    </div>

                                                    {/* Información de la Empresa */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="company-info"
                                                            className="text-sm font-medium"
                                                        >
                                                            Información de la
                                                            Empresa
                                                        </Label>
                                                        <Input
                                                            id="company-info"
                                                            value={companyInfo}
                                                            onChange={(e) =>
                                                                setCompanyInfo(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Ej: TechCorp, tu empresa de tecnología de confianza..."
                                                        />
                                                    </div>

                                                    {/* Intencionalidad del Chat */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="chat-intent"
                                                            className="text-sm font-medium"
                                                        >
                                                            Propósito del
                                                            Chatbot
                                                        </Label>
                                                        <Select
                                                            value={chatIntent}
                                                            onValueChange={
                                                                setChatIntent
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecciona el propósito del chatbot" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {CHAT_INTENTS.map(
                                                                    (
                                                                        intent
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                intent.value
                                                                            }
                                                                            value={
                                                                                intent.value
                                                                            }
                                                                        >
                                                                            <div className="flex flex-col">
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        intent.label
                                                                                    }
                                                                                </span>
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        intent.description
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Prompt Personalizado */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="custom-prompt"
                                                            className="text-sm font-medium"
                                                        >
                                                            Instrucciones
                                                            Adicionales
                                                            (Opcional)
                                                        </Label>
                                                        <Textarea
                                                            id="custom-prompt"
                                                            value={customPrompt}
                                                            onChange={(e) =>
                                                                setCustomPrompt(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Agrega instrucciones específicas sobre cómo quieres que se comporte el asistente..."
                                                            className="min-h-[80px] resize-none"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* Vista previa del prompt */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Vista Previa del Prompt
                                                </Label>
                                                <div className="p-3 bg-muted rounded-lg text-xs max-h-32 overflow-y-auto">
                                                    <pre className="whitespace-pre-wrap font-mono">
                                                        {getCurrentPrompt().substring(
                                                            0,
                                                            500
                                                        )}
                                                        ...
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter className="flex gap-2">
                                            <DialogClose asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    Cancelar
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                onClick={handleSaveConfig}
                                                className="flex-1"
                                            >
                                                Guardar Configuración
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
