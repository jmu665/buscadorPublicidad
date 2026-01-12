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
    const defaultMessage = `¡Hola! Soy Martín Urías. Te contacto porque ando lanzando AgendaApp 360. La diseñé pensando en lo pesado que es llevar el control de las citas a mano. La idea es automatizar todo para que el negocio crezca solo.

Como apenas vamos arrancando, te quiero regalar 30 días de acceso total para que la cales. No te cuesta nada y te quitas de broncas de organización.

Entra aquí para activarla: agendaapp360.com/marketing

¡Ojalá te animes a probarla! Un saludo.`;

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
