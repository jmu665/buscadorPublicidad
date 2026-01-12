import { useState, useEffect } from 'react';

/**
 * Hook para marcar negocios como revisados
 */
export const useReviewedBusinesses = () => {
    const STORAGE_KEY = 'reviewed_businesses';

    const getReviewedBusinesses = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error al leer negocios revisados:', error);
            return [];
        }
    };

    const [reviewedBusinesses, setReviewedBusinesses] = useState(getReviewedBusinesses);

    const toggleReviewed = (businessId, businessName) => {
        const isReviewed = reviewedBusinesses.includes(businessId);
        let newReviewed;

        if (isReviewed) {
            // Quitar de revisados
            newReviewed = reviewedBusinesses.filter(id => id !== businessId);
        } else {
            // Agregar a revisados
            newReviewed = [...reviewedBusinesses, businessId];
        }

        setReviewedBusinesses(newReviewed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviewed));
    };

    const isReviewed = (businessId) => {
        return reviewedBusinesses.includes(businessId);
    };

    const clearReviewed = () => {
        setReviewedBusinesses([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const getReviewedCount = () => {
        return reviewedBusinesses.length;
    };

    return {
        toggleReviewed,
        isReviewed,
        clearReviewed,
        getReviewedCount,
        reviewedBusinesses,
    };
};
