/**
 * Envia el número al Bot de Ventas de AgendaApp360
 * @param {string} phoneNumber - Número de teléfono (ej: +521...)
 * @param {string} message - Mensaje personalizado opcional
 */
export const sendToSalesBot = async (phoneNumber, message) => {
    // Usamos el path relativo para que funcione con el proxy (Dev y Prod)
    const BOT_URL = "/api/bot/hooks/agent";

    // Tu contraseña de bot
    const SECRET = "my-secret-webhook-key";

    // Usar el mensaje recibido o el default si no hay uno
    const messageToSend = message || "¡Hola! 🚀 Vi tu negocio en Maps y creo que AgendaApp360 te ayudaría a automatizar tus citas y vender más. ¿Te gustaría ver un demo rápido?";

    console.log(`📡 Enviando ${phoneNumber} al bot de ventas...`);

    try {
        const response = await fetch(BOT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Autenticación Basic Auth porque cambiamos a modo password
                "Authorization": "Basic " + btoa(":" + "MiBotSeguro123"),
                // También enviamos el secret por si acaso el hook lo pide
                "x-clawdbot-secret": SECRET
            },
            body: JSON.stringify({
                agentId: "main",
                text: `/send ${phoneNumber} ${messageToSend}`
            })
        });

        if (response.ok) {
            console.log(`✅ Éxito: Mensaje enviado a ${phoneNumber}`);
            return true;
        } else {
            const errorText = await response.text();
            console.error(`❌ Error del Bot: ${response.status} - ${errorText}`);
            return false;
        }
    } catch (error) {
        console.error("❌ Error de conexión (Posiblemente el bot esté apagado):", error);
        return false;
    }
};
