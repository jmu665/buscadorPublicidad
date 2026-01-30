import { createContext, useContext, useState, useCallback } from 'react';

const BulkSelectionContext = createContext();

export const BulkSelectionProvider = ({ children }) => {
    const [selectedBusinesses, setSelectedBusinesses] = useState([]);

    const toggleSelection = useCallback((business) => {
        setSelectedBusinesses(prev => {
            const isSelected = prev.some(b => b.id === business.id);
            if (isSelected) {
                return prev.filter(b => b.id !== business.id);
            } else {
                return [...prev, business];
            }
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedBusinesses([]);
    }, []);

    const isSelected = useCallback((businessId) => {
        return selectedBusinesses.some(b => b.id === businessId);
    }, [selectedBusinesses]);

    return (
        <BulkSelectionContext.Provider value={{
            selectedBusinesses,
            toggleSelection,
            clearSelection,
            isSelected
        }}>
            {children}
        </BulkSelectionContext.Provider>
    );
};

export const useBulkSelection = () => {
    const context = useContext(BulkSelectionContext);
    if (!context) {
        throw new Error('useBulkSelection debe ser usado dentro de un BulkSelectionProvider');
    }
    return context;
};
