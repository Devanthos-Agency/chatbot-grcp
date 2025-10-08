"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "grcp-chat-usage";
const MAX_QUESTIONS_PER_DAY = 10;

interface UsageData {
    date: string;
    count: number;
}

export function useDailyLimit() {
    const [questionsLeft, setQuestionsLeft] = useState<number>(MAX_QUESTIONS_PER_DAY);
    const [isLimitReached, setIsLimitReached] = useState<boolean>(false);

    useEffect(() => {
        checkAndUpdateLimit();
    }, []);

    const getTodayDateString = (): string => {
        return new Date().toISOString().split("T")[0];
    };

    const checkAndUpdateLimit = () => {
        const today = getTodayDateString();
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (storedData) {
            try {
                const usageData: UsageData = JSON.parse(storedData);

                // Si es un nuevo día, resetear el contador
                if (usageData.date !== today) {
                    resetUsage();
                } else {
                    const remaining = MAX_QUESTIONS_PER_DAY - usageData.count;
                    setQuestionsLeft(remaining);
                    setIsLimitReached(remaining <= 0);
                }
            } catch (error) {
                console.error("Error al leer datos de uso:", error);
                resetUsage();
            }
        } else {
            resetUsage();
        }
    };

    const resetUsage = () => {
        const today = getTodayDateString();
        const newUsageData: UsageData = {
            date: today,
            count: 0,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsageData));
        setQuestionsLeft(MAX_QUESTIONS_PER_DAY);
        setIsLimitReached(false);
    };

    const incrementUsage = (): boolean => {
        const today = getTodayDateString();
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (storedData) {
            try {
                const usageData: UsageData = JSON.parse(storedData);

                // Si es un nuevo día, resetear
                if (usageData.date !== today) {
                    resetUsage();
                    return incrementUsage();
                }

                // Verificar si ya alcanzó el límite
                if (usageData.count >= MAX_QUESTIONS_PER_DAY) {
                    setIsLimitReached(true);
                    setQuestionsLeft(0);
                    return false;
                }

                // Incrementar el contador
                usageData.count += 1;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(usageData));

                const remaining = MAX_QUESTIONS_PER_DAY - usageData.count;
                setQuestionsLeft(remaining);
                setIsLimitReached(remaining <= 0);

                return true;
            } catch (error) {
                console.error("Error al actualizar uso:", error);
                return false;
            }
        } else {
            resetUsage();
            return incrementUsage();
        }
    };

    const resetLimit = () => {
        resetUsage();
    };

    return {
        questionsLeft,
        isLimitReached,
        incrementUsage,
        resetLimit,
        maxQuestions: MAX_QUESTIONS_PER_DAY,
    };
}
