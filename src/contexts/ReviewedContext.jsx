import { createContext, useState, useContext, useEffect } from 'react';
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    getDocs,
    writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

const ReviewedContext = createContext();

export const ReviewedProvider = ({ children }) => {
    const [reviewedBusinesses, setReviewedBusinesses] = useState([]);
    const [customCategories, setCustomCategories] = useState(['General', 'VIP', 'Seguimiento']);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Sync Categorías
    useEffect(() => {
        const settingsDoc = doc(db, 'settings', 'app_config');
        const unsub = onSnapshot(settingsDoc, (docSnap) => {
            if (docSnap.exists()) {
                setCustomCategories(docSnap.data().categories || ['General', 'VIP', 'Seguimiento']);
            } else {
                // Initialize default categories if they don't exist
                setDoc(settingsDoc, { categories: ['General', 'VIP', 'Seguimiento'] });
            }
        });
        return () => unsub();
    }, []);

    // 2. Sync Leads
    useEffect(() => {
        const leadsCol = collection(db, 'reviewed_leads');
        const unsub = onSnapshot(leadsCol, (querySnapshot) => {
            const leads = [];
            querySnapshot.forEach((doc) => {
                leads.push({ ...doc.data(), id: doc.id });
            });
            setReviewedBusinesses(leads);
            setIsLoading(false);
        });
        return () => unsub();
    }, []);

    // 3. Migración Automática de versión anterior (localStorage -> Firestore)
    useEffect(() => {
        const migrateLocalToCloud = async () => {
            if (isLoading) return;

            const localLeads = localStorage.getItem('reviewed_businesses');
            const localCats = localStorage.getItem('custom_categories');

            if (localLeads || localCats) {
                console.log("Detectados datos de la versión anterior. Migrando a la nube...");
                try {
                    const batch = writeBatch(db);

                    if (localLeads) {
                        const leads = JSON.parse(localLeads);
                        leads.forEach(lead => {
                            const leadDoc = doc(db, 'reviewed_leads', lead.id);
                            batch.set(leadDoc, {
                                ...lead,
                                status: lead.status || 'waiting',
                                city: lead.city || 'Desconocida',
                                createdAt: lead.createdAt || new Date().toISOString()
                            }, { merge: true });
                        });
                    }

                    if (localCats) {
                        const cats = JSON.parse(localCats);
                        const settingsDoc = doc(db, 'settings', 'app_config');
                        batch.set(settingsDoc, { categories: cats }, { merge: true });
                    }

                    await batch.commit();

                    // Limpiamos solo después de confirmar éxito en la nube
                    localStorage.removeItem('reviewed_businesses');
                    localStorage.removeItem('custom_categories');
                    console.log("¡Migración exitosa! Datos antiguos sincronizados con Firebase.");
                } catch (error) {
                    console.error("Error durante la migración:", error);
                }
            }
        };

        migrateLocalToCloud();
    }, [isLoading]);

    const toggleReviewed = async (business, category = 'General') => {
        if (!business || !business.id) return;

        const businessDoc = doc(db, 'reviewed_leads', business.id);
        const isAlreadyReviewed = reviewedBusinesses.some(b => b.id === business.id);

        try {
            if (isAlreadyReviewed) {
                await deleteDoc(businessDoc);
            } else {
                await setDoc(businessDoc, {
                    ...business,
                    category,
                    status: 'waiting',
                    createdAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error("Error toggling lead:", error);
        }
    };

    const updateCategory = async (businessId, newCategory) => {
        try {
            const businessDoc = doc(db, 'reviewed_leads', businessId);
            await updateDoc(businessDoc, { category: newCategory });
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const updateStatus = async (businessId, newStatus) => {
        try {
            const businessDoc = doc(db, 'reviewed_leads', businessId);
            await updateDoc(businessDoc, { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const isReviewed = (businessId) => {
        return reviewedBusinesses.some(b => b.id === businessId);
    };

    const clearReviewed = async () => {
        if (!window.confirm('¿Estás seguro de que quieres borrar todos los negocios revisados de la base de datos?')) return;

        try {
            const batch = writeBatch(db);
            reviewedBusinesses.forEach(lead => {
                const leadDoc = doc(db, 'reviewed_leads', lead.id);
                batch.delete(leadDoc);
            });
            await batch.commit();
        } catch (error) {
            console.error("Error clearing leads:", error);
        }
    };

    const addCustomCategory = async (name) => {
        if (!name || customCategories.includes(name)) return;

        try {
            const newCats = [...customCategories, name];
            const settingsDoc = doc(db, 'settings', 'app_config');
            await updateDoc(settingsDoc, { categories: newCats });
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const removeCustomCategory = async (name) => {
        if (name === 'General') return;

        try {
            const newCats = customCategories.filter(c => c !== name);
            const settingsDoc = doc(db, 'settings', 'app_config');

            const batch = writeBatch(db);
            // Update settings
            batch.update(settingsDoc, { categories: newCats });

            // Move businesses to General
            reviewedBusinesses.forEach(b => {
                if (b.category === name) {
                    const leadDoc = doc(db, 'reviewed_leads', b.id);
                    batch.update(leadDoc, { category: 'General' });
                }
            });

            await batch.commit();
        } catch (error) {
            console.error("Error removing category:", error);
        }
    };

    return (
        <ReviewedContext.Provider value={{
            reviewedBusinesses,
            customCategories,
            toggleReviewed,
            updateCategory,
            updateStatus,
            isReviewed,
            clearReviewed,
            addCustomCategory,
            removeCustomCategory,
            isLoading,
            getReviewedCount: () => reviewedBusinesses.length
        }}>
            {children}
        </ReviewedContext.Provider>
    );
};

export const useReviewed = () => {
    const context = useContext(ReviewedContext);
    if (!context) {
        throw new Error('useReviewed must be used within a ReviewedProvider');
    }
    return context;
};
