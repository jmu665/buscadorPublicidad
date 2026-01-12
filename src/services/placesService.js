import axios from 'axios';
import { GOOGLE_PLACES_API_KEY, GOOGLE_PLACES_API_URL } from '../config/api';

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
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.rating,places.userRatingCount,places.googleMapsUri,places.photos,nextPageToken'
                }
            }
        );

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
            phone: place.nationalPhoneNumber || place.internationalPhoneNumber || null,
            rating: place.rating || null,
            ratingCount: place.userRatingCount || 0,
            mapsUrl: place.googleMapsUri || null,
            photoUrl: place.photos && place.photos.length > 0
                ? getPhotoUrl(place.photos[0].name)
                : null,
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
