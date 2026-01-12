import { useReviewed } from '../contexts/ReviewedContext';

/**
 * Hook para marcar negocios como revisados
 */
export const useReviewedBusinesses = () => {
    return useReviewed();
};
