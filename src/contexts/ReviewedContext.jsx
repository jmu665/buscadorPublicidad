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
    const [firebaseError, setFirebaseError] = useState(null);

    // 1. Sync Categorías
    useEffect(() => {
        const settingsDoc = doc(db, 'settings', 'app_config');
        const unsub = onSnapshot(settingsDoc,
            (docSnap) => {
                setFirebaseError(null);
                if (docSnap.exists()) {
                    setCustomCategories(docSnap.data().categories || ['General', 'VIP', 'Seguimiento']);
                } else {
                    setDoc(settingsDoc, { categories: ['General', 'VIP', 'Seguimiento'] }).catch(err => {
                        console.error("Error inicializando categorías:", err);
                        if (err.code === 'permission-denied') setFirebaseError('Permisos de Firebase insuficientes');
                    });
                }
            },
            (error) => {
                console.error("Error en listener de categorías:", error);
                if (error.code === 'permission-denied') setFirebaseError('Permisos de Firebase insuficientes');
            }
        );
        return () => unsub();
    }, []);

    // 2. Sync Leads
    useEffect(() => {
        const leadsCol = collection(db, 'reviewed_leads');
        const unsub = onSnapshot(leadsCol,
            (querySnapshot) => {
                setFirebaseError(null);
                const leads = [];
                querySnapshot.forEach((doc) => {
                    leads.push({ ...doc.data(), id: doc.id });
                });
                setReviewedBusinesses(leads);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error en listener de leads:", error);
                if (error.code === 'permission-denied') setFirebaseError('Permisos de Firebase insuficientes');
                setIsLoading(false);
            }
        );
        return () => unsub();
    }, []);

    // 3. Migración Automática
    useEffect(() => {
        const migrateLocalToCloud = async () => {
            if (isLoading || firebaseError) return;

            const localLeads = localStorage.getItem('reviewed_businesses');
            const localCats = localStorage.getItem('custom_categories');

            if (localLeads || localCats) {
                try {
                    const batch = writeBatch(db);
                    let hasChanges = false;

                    if (localLeads) {
                        const leads = JSON.parse(localLeads);
                        leads.forEach(lead => {
                            if (lead && lead.id) {
                                const leadId = String(lead.id);
                                const leadDoc = doc(db, 'reviewed_leads', leadId);
                                batch.set(leadDoc, {
                                    ...lead,
                                    id: leadId,
                                    status: lead.status || 'waiting',
                                    city: lead.city || 'Desconocida',
                                    createdAt: lead.createdAt || new Date().toISOString()
                                }, { merge: true });
                                hasChanges = true;
                            }
                        });
                    }

                    if (localCats) {
                        const cats = JSON.parse(localCats);
                        const settingsDoc = doc(db, 'settings', 'app_config');
                        batch.set(settingsDoc, { categories: cats }, { merge: true });
                        hasChanges = true;
                    }

                    if (hasChanges) {
                        await batch.commit();
                        localStorage.removeItem('reviewed_businesses');
                        localStorage.removeItem('custom_categories');
                    }
                } catch (error) {
                    console.error("Error durante la migración:", error);
                }
            }
        };

        migrateLocalToCloud();
    }, [isLoading, firebaseError]);

    const toggleReviewed = async (business, category = 'General') => {
        if (!business || !business.id) return;

        const businessId = String(business.id);
        const businessDoc = doc(db, 'reviewed_leads', businessId);
        const isAlreadyReviewed = reviewedBusinesses.some(b => b.id === businessId);

        try {
            if (isAlreadyReviewed) {
                console.log("Removiendo lead de la nube:", businessId);
                await deleteDoc(businessDoc);
            } else {
                console.log("Guardando lead en la nube:", businessId);
                await setDoc(businessDoc, {
                    ...business,
                    id: businessId,
                    category,
                    status: 'waiting',
                    createdAt: new Date().toISOString()
                });
            }
            setFirebaseError(null);
        } catch (error) {
            console.error("Error toggling lead:", error);
            setFirebaseError(`Error al guardar/borrar: ${error.message}`);
        }
    };

    const updateCategory = async (businessId, newCategory) => {
        try {
            const docId = String(businessId);
            const businessDoc = doc(db, 'reviewed_leads', docId);
            await updateDoc(businessDoc, { category: newCategory });
            setFirebaseError(null);
        } catch (error) {
            console.error("Error updating category:", error);
            setFirebaseError(`Error al actualizar categoría: ${error.message}`);
        }
    };

    const updateStatus = async (businessId, newStatus) => {
        try {
            const docId = String(businessId);
            const businessDoc = doc(db, 'reviewed_leads', docId);
            await updateDoc(businessDoc, { status: newStatus });
            setFirebaseError(null);
        } catch (error) {
            console.error("Error updating status:", error);
            setFirebaseError(`Error al actualizar estatus: ${error.message}`);
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
                    const leadId = String(b.id);
                    const leadDoc = doc(db, 'reviewed_leads', leadId);
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
            firebaseError,
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
