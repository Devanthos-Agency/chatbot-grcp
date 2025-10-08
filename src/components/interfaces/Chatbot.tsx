"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import {
    Globe,
    ArrowRight,
    Loader2,
    CircleStop,
    AlertCircle,
} from "lucide-react";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { GRCP_SYSTEM_PROMPT } from "@/lib/grcp-prompt";
import {
    Message,
    MessageContent,
    MessageAvatar,
} from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import type { UIMessage } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { useDailyLimit } from "@/hooks/use-daily-limit";

import { Marquee } from "@/components/ui/marquee";
import { AuroraText } from "../ui/aurora-text";
import { AnimatedShinyText } from "../ui/animated-shiny-text";

// Sugerencias de ejemplo para el marquee - GRCP Argentina
const suggestions = [
    "¿Qué hacer en caso de un paro cardíaco?",
    "¿Cómo realizar RCP correctamente?",
    "¿Qué hacer si alguien se está atragantando?",
    "¿Cuáles son los cursos de primeros auxilios disponibles?",
    "¿Dónde encuentro desfibriladores en Argentina?",
    "¿Cómo tratar una herida sangrante?",
    "¿Qué es la certificación de GRCP Argentina?",
    "¿Cómo actuar ante una convulsión?",
    "¿Qué hacer en caso de quemadura?",
    "¿Cómo identificar un infarto?",
    "¿Qué recursos educativos tienen disponibles?",
    "¿Ofrecen capacitaciones para empresas?",
];

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
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [animating, setAnimating] = useState(false);

    // Auto-resize del textarea
    const autoResize = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height =
                Math.min(inputRef.current.scrollHeight, 120) + "px";
        }
    }, []);

    useEffect(() => {
        autoResize();
    }, [value, autoResize]);

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !animating) {
            e.preventDefault();
            // Enviar directamente sin animación cuando se presiona Enter
            if (inputRef.current?.value.trim()) {
                const form = inputRef.current.closest("form");
                if (form) {
                    const submitEvent = new Event("submit", {
                        bubbles: true,
                        cancelable: true,
                    });
                    form.dispatchEvent(submitEvent);
                }
            }
        }
    };

    const vanishAndSubmit = () => {
        setAnimating(true);
        draw();

        const currentValue = inputRef.current?.value || "";
        if (currentValue && inputRef.current) {
            const maxX = newDataRef.current.reduce(
                (prev, current) => (current.x > prev ? current.x : prev),
                0
            );
            animate(maxX);

            // Crear y enviar evento de submit después de iniciar la animación
            setTimeout(() => {
                const form = inputRef.current?.closest("form");
                if (form) {
                    const submitEvent = new Event("submit", {
                        bubbles: true,
                        cancelable: true,
                    });
                    form.dispatchEvent(submitEvent);
                }
            }, 100);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Si hay valor, proceder con el envío
        if (value.trim()) {
            setValue(""); // Limpiar inmediatamente
            onSubmit(e); // Enviar el formulario
        }
    };

    return (
        <form
            className={cn(
                "relative mx-auto min-h-12 w-full max-w-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl",
                value && "border-primary/30 shadow-md",
                className
            )}
            onSubmit={handleSubmit}
        >
            <canvas
                className={cn(
                    "pointer-events-none absolute -left-2 top-2 origin-top-left scale-50 transform pr-20 text-base invert filter",
                    !animating ? "opacity-0" : "opacity-100"
                )}
                ref={canvasRef}
            />
            <textarea
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
                rows={1}
                className={cn(
                    "relative z-50 min-h-12 w-full border-none bg-transparent pl-4 pr-12 py-3 text-sm tracking-tight text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 resize-none overflow-hidden",
                    animating && "text-transparent"
                )}
            />

            <button
                disabled={!value}
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    if (value.trim()) {
                        vanishAndSubmit();
                    }
                }}
                className="absolute right-2 bottom-2 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
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

    // Hook para el límite diario
    const { questionsLeft, isLimitReached, incrementUsage, maxQuestions } = useDailyLimit();

    const { messages, sendMessage, status, error, stop } = useChat({
        onError: (error) => {
            console.error("Error en el chat:", error);
        },
        onFinish: ({ message, messages }) => {
            console.log("Mensaje completado:", message);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!value.trim()) return;

        // Verificar límite diario
        if (isLimitReached) {
            alert(`Has alcanzado el límite diario de ${maxQuestions} preguntas. Vuelve mañana o contacta a GRCP Argentina para más información.`);
            return;
        }

        // Intentar incrementar el uso
        const canProceed = incrementUsage();
        if (!canProceed) {
            alert(`Has alcanzado el límite diario de ${maxQuestions} preguntas. Vuelve mañana.`);
            return;
        }

        sendMessage(
            {
                text: value,
            },
            {
                body: {
                    systemPrompt: GRCP_SYSTEM_PROMPT,
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

    // Vista unificada que mantiene la misma UI siempre
    return (
        <section className="h-dvh min-h-dvh">
            <div className="container py-4 px-2 mx-auto flex h-dvh w-full flex-col items-center justify-center ">
                <div className="flex h-full w-full max-w-4xl flex-col items-center justify-center gap-4">
                    {/* Header/Title - se reduce cuando hay mensajes */}
                    <motion.div
                        className={cn(
                            "text-center transition-all duration-500",
                            messages.length > 0
                                ? "my-4"
                                : "my-[8vh] md:my-[20vh]"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1
                            className={cn(
                                "font-bold tracking-tighter transition-all duration-500",
                                messages.length > 0
                                    ? "text-2xl mb-2"
                                    : "text-5xl mb-8"
                            )}
                        >
                            <AuroraText
                                colors={[
                                    "#1C487E",
                                    "#60a5fa",
                                    "#1C487E",
                                    "#3b82f6",
                                ]}
                                className={cn(
                                    "relative ",
                                    messages.length > 0 ? "left-1/4" : ""
                                )}
                            >
                                {messages.length > 0
                                    ? "Asistente GRCP"
                                    : "¿Cómo podemos ayudarte?"}
                            </AuroraText>
                            <AuroraText
                                colors={[
                                    "#1C487E",
                                    "#60a5fa",
                                    "#1C487E",
                                    "#3b82f6",
                                ]}
                                className={cn(
                                    "absolute -z-10",
                                    messages.length > 0
                                        ? "top-0 -left-1/4 blur-lg"
                                        : "-top-24 blur-xl  md:-top-12"
                                )}
                            >
                                {messages.length > 0
                                    ? "Asistente GRCP"
                                    : "¿Cómo podemos ayudarte?"}
                            </AuroraText>
                        </h1>
                        {messages.length > 0 && (
                            <motion.div
                                className="flex flex-col gap-1 text-sm text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <p>Rescate • Capacitación • Prevención</p>
                                <p className={cn(
                                    "text-xs",
                                    questionsLeft <= 3 && "text-orange-500 font-semibold",
                                    isLimitReached && "text-red-500 font-bold"
                                )}>
                                    {isLimitReached 
                                        ? `⚠️ Límite alcanzado (${maxQuestions}/${maxQuestions})` 
                                        : `Preguntas disponibles: ${questionsLeft}/${maxQuestions}`}
                                </p>
                            </motion.div>
                        )}
                        {messages.length === 0 && (
                            <motion.div
                                className="mt-4 max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <div className="bg-blue-50 border-l-4 border-orange-400 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-800">
                                            <p className="font-semibold mb-1">⚠️ Aviso Importante</p>
                                            <p className="text-xs leading-relaxed">
                                                Este asistente proporciona información orientativa. 
                                                <strong className="font-semibold"> NO sustituye atención médica profesional</strong>. 
                                                En emergencias, llama al <strong className="font-bold">107</strong> inmediatamente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
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
                                                            duration: 0.5,
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
                                                                className={
                                                                    message.role ===
                                                                    "user"
                                                                        ? "order-2 mb-auto mt-1.5"
                                                                        : "order-1 mb-auto"
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
                                                                                    className="prose prose-sm max-w-none"
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
                                                            name="Asistente GRCP"
                                                            className="order-1 mb-auto"
                                                        />
                                                        <MessageContent variant="flat">
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <div className="flex gap-1">
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                </div>
                                                                <AnimatedShinyText>
                                                                    Pensando...
                                                                </AnimatedShinyText>
                                                                {status ===
                                                                    "streaming" && (
                                                                    <Button
                                                                        onClick={
                                                                            stop
                                                                        }
                                                                        size={
                                                                            "icon"
                                                                        }
                                                                        className="bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                                    >
                                                                        <CircleStop className="h-4 w-4" />
                                                                    </Button>
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
                                                    className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                                                >
                                                    <div className="text-red-600">
                                                        ⚠️
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-red-800 font-medium">
                                                            Error en la
                                                            conversación
                                                        </p>
                                                        <p className="text-red-600 text-sm">
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
                            placeholder={isLimitReached 
                                ? "⚠️ Límite diario alcanzado" 
                                : "Escribe tu pregunta sobre primeros auxilios, RCP o emergencias..."}
                            className="mb-4 min-h-12 w-full max-w-full bg-transparent shadow-none"
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            value={value}
                            setValue={setValue}
                        />

                        <div className="flex h-10 w-full items-center justify-between">
                            <div className="flex items-center gap-4">
                                {messages.length === 0 && (
                                    <span className={cn(
                                        "text-xs px-3 py-1.5 rounded-full font-medium",
                                        questionsLeft <= 3 
                                            ? "bg-amber-50 text-amber-700 border border-amber-200" 
                                            : "bg-sky-50 text-sky-700 border border-sky-200",
                                        isLimitReached && "bg-red-50 text-red-700 border border-red-200"
                                    )}>
                                        {isLimitReached 
                                            ? `⚠️ Límite alcanzado (${maxQuestions}/${maxQuestions})` 
                                            : `${questionsLeft}/${maxQuestions} preguntas disponibles`}
                                    </span>
                                )}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span
                                            onClick={() =>
                                                setSearchEnabled(!searchEnabled)
                                            }
                                            className={cn(
                                                "flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 text-sm transition-all",
                                                searchEnabled &&
                                                    "bg-sky-900 text-sky-300 dark:text-sky-300"
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
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
