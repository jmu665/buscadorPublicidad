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
    const defaultMessage = `¡Hola! Soy Martín Urías. Vi tu negocio en Google Maps y te contacto porque hice una app (AgendaApp 360) para que dueños de negocios automaticen sus citas y dejen de perder tiempo con el celular.

Te regalo 30 días para que la pruebes sin compromiso. Es súper fácil de usar.

Aquí la ves: agendaapp360.com/marketing

¡Cualquier cosa quedo a la orden, gracias!`;

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
