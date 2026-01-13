/**
 * Genera un enlace de WhatsApp para contactar a un negocio
 * @param {string} phoneNumber - Número de teléfono del negocio
 * @param {string} businessName - Nombre del negocio
 * @returns {string} - URL de WhatsApp
 */
export const generateWhatsAppLink = (phoneNumber, businessName = '') => {
    if (!phoneNumber) return null;

    // Limpiar el número de teléfono (eliminar espacios, guiones, paréntesis, etc.)
    let cleanNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, '');

    // Si el número no tiene código de país, intentar agregar uno genérico
    // Nota: Idealmente el usuario debería configurar su código de país por defecto
    if (cleanNumber.length < 10) {
        return null; // Número inválido
    }

    // Mensaje predeterminado - Promoción AgendaApp 360
    const defaultMessage = `"¡Qué tal! ¿Cómo están? Soy Martín Urías. 
Los busco porque ando lanzando una aplicación para automatizar citas y quitarles de encima el peso de la agenda a mano. 

Ahorita abrí 10 lugares para calarla gratis por un mes con acceso completo.

Pensé en escribirles por aquí por si quieren aprovechar y organizar su negocio de una vez por todas sin que les cueste nada.

"¿Les serviría algo así para su negocio o ya tienen algún sistema que les haga la chamba?"`;

    const encodedMessage = encodeURIComponent(defaultMessage);

    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};

/**
 * Abre el enlace de WhatsApp en una nueva ventana
 * @param {string} phoneNumber - Número de teléfono
 * @param {string} businessName - Nombre del negocio
 */
export const openWhatsApp = (phoneNumber, businessName = '') => {
    const link = generateWhatsAppLink(phoneNumber, businessName);
    if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
    }
};
