import { useState, useEffect } from 'react';

/**
 * Hook personalizado para contar búsquedas mensuales
 * Se resetea automáticamente cada mes
 */
export const useSearchCounter = () => {
    const STORAGE_KEY = 'business_finder_search_count';
    const FREE_TIER_LIMIT = 5000; // Primer nivel gratuito
    const CREDIT_LIMIT = 6250; // Búsquedas cubiertas por $200 de crédito

    const getCurrentMonthKey = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const getStoredData = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error al leer contador:', error);
            return null;
        }
    };

    const initializeCounter = () => {
        const currentMonth = getCurrentMonthKey();
        const stored = getStoredData();

        // Si no hay datos o es un mes diferente, resetear
        if (!stored || stored.month !== currentMonth) {
            const newData = {
                month: currentMonth,
                count: 0,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            return 0;
        }

        return stored.count;
    };

    const [searchCount, setSearchCount] = useState(initializeCounter);

    useEffect(() => {
        // Verificar si cambió el mes cada vez que se carga el componente
        const currentMonth = getCurrentMonthKey();
        const stored = getStoredData();

        if (stored && stored.month !== currentMonth) {
            // Resetear contador si cambió el mes
            const newData = {
                month: currentMonth,
                count: 0,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            setSearchCount(0);
        }
    }, []);

    const incrementCounter = () => {
        const currentMonth = getCurrentMonthKey();
        const newCount = searchCount + 1;

        const newData = {
            month: currentMonth,
            count: newCount,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        setSearchCount(newCount);
    };

    const resetCounter = () => {
        const currentMonth = getCurrentMonthKey();
        const newData = {
            month: currentMonth,
            count: 0,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        setSearchCount(0);
    };

    const getUsageStats = () => {
        const percentageOfFreeTier = (searchCount / FREE_TIER_LIMIT) * 100;
        const percentageOfCredit = (searchCount / CREDIT_LIMIT) * 100;

        let status = 'safe'; // safe, warning, danger
        if (searchCount >= CREDIT_LIMIT) {
            status = 'danger';
        } else if (searchCount >= FREE_TIER_LIMIT) {
            status = 'warning';
        }

        const estimatedCost = Math.max(0, (searchCount - FREE_TIER_LIMIT) * 0.032);
        const remainingCredit = Math.max(0, 200 - estimatedCost);

        return {
            count: searchCount,
            freeTierRemaining: Math.max(0, FREE_TIER_LIMIT - searchCount),
            percentageOfFreeTier,
            percentageOfCredit,
            status,
            estimatedCost: estimatedCost.toFixed(2),
            remainingCredit: remainingCredit.toFixed(2),
            isOverFreeTier: searchCount > FREE_TIER_LIMIT,
            isOverCredit: searchCount > CREDIT_LIMIT,
        };
    };

    return {
        searchCount,
        incrementCounter,
        resetCounter,
        getUsageStats,
        FREE_TIER_LIMIT,
        CREDIT_LIMIT,
    };
};
