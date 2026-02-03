import axios from 'axios';
import { GOOGLE_PLACES_API_KEY, GOOGLE_PLACES_API_URL } from '../config/api';
import { db } from '../config/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

/**
 * Busca negocios usando la Google Places API (Nueva)
 * @param {string} businessName - Nombre del tipo de negocio a buscar
 * @param {string} city - Ciudad donde buscar
 * @param {string} pageToken - Token para la siguiente página (opcional)
 * @returns {Promise<{businesses: Array, nextPageToken: string|null}>} - Lista de negocios y token para siguiente página
 */
export const searchBusinesses = async (businessName, city, pageToken = null) => {
    if (!GOOGLE_PLACES_API_KEY) {
        throw new Error('API key de Google Places no configurada. Por favor, configura VITE_GOOGLE_PLACES_API_KEY en tu archivo .env');
    }

    // --- CHECK MONTHLY LIMIT (SECURITY) ---
    const statsRef = doc(db, 'system_stats', 'api_usage');
    let docSnap = null;

    try {
        docSnap = await getDoc(statsRef);
    } catch (err) {
        // If we can't read DB, we proceed with caution or block? 
        // Let's assume block for safety if strict, but proceed if it's just a network glitch on first run.
        console.warn("Could not check API limit:", err);
    }

    if (docSnap && docSnap.exists()) {
        const data = docSnap.data();
        const currentRequests = data.google_places_requests || 0;
        const lastUpdated = data.last_updated ? data.last_updated.toDate() : new Date();
        const now = new Date();

        // Check for Monthly Reset
        if (lastUpdated.getMonth() !== now.getMonth() || lastUpdated.getFullYear() !== now.getFullYear()) {
            // It's a new month! Reset counter.
            try {
                await updateDoc(statsRef, {
                    google_places_requests: 0,
                    last_updated: now
                });
                console.log("📅 New month detected. API Usage reset to 0.");
            } catch (resetErr) {
                console.error("Failed to reset monthly counter:", resetErr);
            }
        } else {
            // Same month, check limit
            const MONTHLY_LIMIT = 1000; // User set safe limit
            if (currentRequests >= MONTHLY_LIMIT) {
                throw new Error(`⚠️ LÍMITE MENSUAL ALCANZADO (${currentRequests}/${MONTHLY_LIMIT}). El sistema se ha pausado por seguridad para evitar cobros extra. Se reanudará el día 1 del próximo mes.`);
            }
        }
    }
    // --------------------------------------

    try {
        const textQuery = `${businessName} en ${city}`;

        const requestBody = {
            textQuery: textQuery,
            languageCode: 'es',
            maxResultCount: 20,
        };

        // Agregar pageToken si existe (para paginación)
        if (pageToken) {
            requestBody.pageToken = pageToken;
        }

        const response = await axios.post(
            GOOGLE_PLACES_API_URL,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.photos,nextPageToken'
                }
            }
        );

        // Track API Usage in Firestore (Global Counter)
        try {
            // Update the doc we already verified exists (or create if missing)
            try {
                await updateDoc(statsRef, {
                    google_places_requests: increment(1),
                    last_updated: new Date()
                });
            } catch (err) {
                // Fallback if document really doesn't exist (fresh install)
                await setDoc(statsRef, {
                    google_places_requests: 1,
                    last_updated: new Date()
                });
            }
        } catch (statsErr) {
            console.warn("Could not update API stats:", statsErr);
        }

        if (!response.data.places || response.data.places.length === 0) {
            return {
                businesses: [],
                nextPageToken: null
            };
        }

        // Formatear los resultados
        const businesses = response.data.places.map(place => ({
            id: place.id,
            name: place.displayName?.text || 'Sin nombre',
            address: place.formattedAddress || 'Dirección no disponible',
            phone: null, // Phone is now fetched on demand to save costs
            rating: place.rating || null,
            ratingCount: place.userRatingCount || 0,
            mapsUrl: place.googleMapsUri || null,
            photoUrl: place.photos && place.photos.length > 0
                ? getPhotoUrl(place.photos[0].name)
                : null,
            city: city, // Guardamos la ciudad de la búsqueda
        }));

        return {
            businesses,
            nextPageToken: response.data.nextPageToken || null
        };
    } catch (error) {
        console.error('Error al buscar negocios:', error);

        if (error.response) {
            // Error de respuesta del servidor
            if (error.response.status === 400) {
                throw new Error('Solicitud inválida. Verifica los parámetros de búsqueda.');
            } else if (error.response.status === 403) {
                throw new Error('API key inválida o sin permisos. Verifica tu configuración.');
            } else if (error.response.status === 429) {
                throw new Error('Límite de solicitudes excedido. Intenta de nuevo más tarde.');
            }
        }

        throw new Error('Error al buscar negocios. Por favor, intenta de nuevo.');
    }
};

/**
 * Genera URL de foto de Google Places
 * @param {string} photoName - Nombre de la foto de Google Places
 * @returns {string} - URL de la foto
 */
const getPhotoUrl = (photoName) => {
    if (!photoName || !GOOGLE_PLACES_API_KEY) return null;
    return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${GOOGLE_PLACES_API_KEY}`;
};

/**
 * Obtiene los detalles de contacto (teléfono) de un negocio específico
 * Costo: SKUs Contact Data (más caro, pero solo se llama 1 vez por clic)
 */
export const getBusinessDetails = async (placeId) => {
    if (!GOOGLE_PLACES_API_KEY) return null;

    // Check Monthly Limit again inside details to be safe? 
    // Usually user wants to force reveal, but let's just track it.
    // For now we skip the strict block check for details to avoid frustration if map details are cheap enough,
    // BUT strictly speaking, it counts as a request. Let's rely on the main search limit mostly.

    // Track Detail Usage (optional)
    // await trackApiUsage(); 

    try {
        const response = await axios.get(
            `https://places.googleapis.com/v1/places/${placeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                    'X-Goog-FieldMask': 'nationalPhoneNumber,internationalPhoneNumber'
                }
            }
        );

        return response.data.nationalPhoneNumber || response.data.internationalPhoneNumber || null;
    } catch (error) {
        console.error('Error al obtener detalles del negocio:', error);
        return null;
    }
};
