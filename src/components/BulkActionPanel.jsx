import { useState, useEffect } from 'react';
import { useBulkSelection } from '../contexts/BulkSelectionContext';
import { sendToSalesBot } from '../utils/botSales';

const BulkActionPanel = () => {
    const { selectedBusinesses, clearSelection } = useBulkSelection();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState(`¡Qué tal! ¿Cómo están? Soy Martín Urías. 
Los busco porque ando lanzando una aplicación para automatizar citas y quitarles de encima el peso de la agenda a mano. 

Ahorita abrí 10 lugares para calarla gratis por un mes con acceso completo.

Pensé en escribirles por aquí por si quieren aprovechar y organizar su negocio de una vez por todas sin que les cueste nada.

"¿Les serviría algo así para su negocio o ya tienen algún sistema que les haga la chamba?"`);

    const [imageUrl, setImageUrl] = useState('');
    const [currentSendingIndex, setCurrentSendingIndex] = useState(null);
    const [isAutoSending, setIsAutoSending] = useState(false);
    const [generatedLinks, setGeneratedLinks] = useState('');
    const [showLinks, setShowLinks] = useState(false);
    const [useBot, setUseBot] = useState(false);

    // Efecto para el envío automático
    useEffect(() => {
        let interval;
        if (isAutoSending && currentSendingIndex !== null) {
            interval = setInterval(() => {
                if (currentSendingIndex < selectedBusinesses.length - 1) {
                    const nextIndex = currentSendingIndex + 1;
                    setCurrentSendingIndex(nextIndex);
                    sendToBusiness(nextIndex);
                } else {
                    setIsAutoSending(false); // Terminar al llegar al último
                }
            }, 10000); // 10 segundos entre mensajes para evitar spam
        }
        return () => clearInterval(interval);
    }, [isAutoSending, currentSendingIndex, selectedBusinesses]);

    if (selectedBusinesses.length === 0) return null;

    const generateLinks = () => {
        const links = selectedBusinesses.map(b => {
            const msgToUse = message || '';
            let finalMessage = msgToUse.replace('{{name}}', b.name || '');
            if (imageUrl) finalMessage += `\n\n${imageUrl}`;

            const cleanPhone = (b.phone || '').replace(/\D/g, '');
            if (!cleanPhone) return `Error: ${b.name} sin teléfono`;

            const encodedMessage = encodeURIComponent(finalMessage);
            return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        }).join('\n');

        setGeneratedLinks(links);
        setShowLinks(true);
    };

    const toggleAutoSend = () => {
        if (!isAutoSending) {
            // Iniciar
            if (currentSendingIndex === null || currentSendingIndex >= selectedBusinesses.length - 1) {
                setCurrentSendingIndex(0);
                sendToBusiness(0);
            }
            setIsAutoSending(true);
        } else {
            // Detener
            setIsAutoSending(false);
        }
    };

    const handleSendNext = () => {
        if (currentSendingIndex === null) {
            setCurrentSendingIndex(0);
            sendToBusiness(0);
        } else if (currentSendingIndex < selectedBusinesses.length - 1) {
            const nextIndex = currentSendingIndex + 1;
            setCurrentSendingIndex(nextIndex);
            sendToBusiness(nextIndex);
        }
    };

    const sendToBusiness = async (index) => {
        const business = selectedBusinesses[index];
        if (business && business.phone) {
            const msgToUse = message || '';
            let finalMessage = msgToUse.replace('{{name}}', business.name || '');

            if (imageUrl) {
                finalMessage += `\n\n${imageUrl}`;
            }

            const cleanPhone = business.phone.replace(/\D/g, '');

            if (useBot) {
                // Envío vía Bot
                const success = await sendToSalesBot(cleanPhone, finalMessage);
                if (success) {
                    // Opcional: Feedback visual extra si quisieras
                }
            } else {
                // Envío Manual (WhatsApp Web)
                const encodedMessage = encodeURIComponent(finalMessage);
                window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
            }
        }
    };

    return (
        <>
            {/* Panel Flotante Inferior */}
            <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
                <div className="max-w-3xl mx-auto bg-[#1e293b] border border-slate-700 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
                            {selectedBusinesses.length}
                        </div>
                        <div className="text-sm">
                            <h3 className="font-bold text-white">Negocios seleccionados</h3>
                            <p className="text-slate-400">Listos para contactar</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearSelection}
                            className="text-slate-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                        >
                            Componer Mensaje 💬
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Envío */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#161e2d] w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Envío Masivo</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Toggle Modo de Envío */}
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-white text-sm">Método de Envío</h3>
                                    <p className="text-xs text-slate-400">Elige cómo quieres contactar a los clientes</p>
                                </div>
                                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                                    <button
                                        onClick={() => setUseBot(false)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${!useBot ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => setUseBot(true)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${useBot ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Bot AI 🤖
                                    </button>
                                </div>
                            </div>

                            {/* Editor de Mensaje */}
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">
                                    Mensaje (Opcional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Hola {{name}}, vi su negocio en..."
                                    className="w-full h-32 bg-[#0b0f1a] border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Tip: Usa <span className="text-blue-400 font-mono">{`{{ name }}`}</span> para insertar el nombre del negocio automáticamente.
                                </p>
                            </div>



                            <div className="flex justify-between items-center pt-2">
                                <p className="text-xs text-slate-500 mt-2">
                                    Tip: Usa <span className="text-blue-400 font-mono">{`{{ name }}`}</span> para insertar el nombre del negocio automáticamente.
                                </p>
                            </div>

                            {/* URL de Imagen */}
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">
                                    Enlace de Imagen / Promoción (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://ejemplo.com/mi-flyer.jpg"
                                    className="w-full bg-[#0b0f1a] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-[10px] text-slate-500 mt-2">
                                    Se agregará al final del mensaje. Nota: WhatsApp Web no permite adjuntar archivos automáticamente, solo enlaces.
                                </p>
                            </div>

                            {/* Lista de Envío */}
                            <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-xl bg-[#0b0f1a]/50">
                                {selectedBusinesses.map((b, idx) => {
                                    if (!b) return null;
                                    const isSent = currentSendingIndex !== null && idx < currentSendingIndex;
                                    const isCurrent = currentSendingIndex !== null && idx === currentSendingIndex;
                                    const isPending = currentSendingIndex === null || idx > currentSendingIndex;

                                    return (
                                        <div key={b.id || idx} className={`p-3 border-b border-slate-800 flex justify-between items-center ${isCurrent ? 'bg-blue-500/10' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${isSent ? 'bg-green-500' : isCurrent ? 'bg-yellow-500 animate-pulse' : 'bg-slate-600'
                                                    }`} />
                                                <div>
                                                    <p className="font-medium text-slate-200 text-sm">{b.name || 'Sin Nombre'}</p>
                                                    <p className="text-xs text-slate-500">{b.phone || 'Sin teléfono'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                {isSent && <span className="text-xs text-green-500 font-bold">Enviado ✅</span>}
                                                {isCurrent && <span className="text-xs text-yellow-500 font-bold">Enviando...</span>}
                                                {isPending && !isCurrent && (
                                                    <button
                                                        onClick={() => {
                                                            setCurrentSendingIndex(idx);
                                                            sendToBusiness(idx);
                                                        }}
                                                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700"
                                                    >
                                                        Enviar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-4">
                                <div className="text-sm text-slate-400">
                                    {currentSendingIndex !== null
                                        ? `Progreso: ${currentSendingIndex + 1} / ${selectedBusinesses.length}`
                                        : isAutoSending ? 'Enviando automáticamente...' : `${selectedBusinesses.length} destinatarios`
                                    }
                                </div>
                                <div className="flex gap-3">
                                    {!isAutoSending && (
                                        <>
                                            <button
                                                onClick={generateLinks}
                                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg border border-slate-600 flex items-center gap-2 text-xs"
                                                title="Ver todos los enlaces para usar en otra herramienta"
                                            >
                                                🔗 Enlaces
                                            </button>
                                            <button
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-4 py-2 text-slate-300 hover:text-white font-medium"
                                            >
                                                Cerrar
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={toggleAutoSend}
                                        className={`px-6 py-2 font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all ${isAutoSending
                                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                            : 'bg-green-600 hover:bg-green-500 text-white'
                                            }`}
                                    >
                                        {isAutoSending ? '⏹ Detener Automático' : '▶ Iniciar Envío Auto'}
                                    </button>
                                </div>
                            </div>

                            {/* Vista de Enlaces Generados */}
                            {showLinks && (
                                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                                    <div className="bg-[#161e2d] w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                                            <h3 className="text-lg font-bold text-white">Enlaces Generados ({selectedBusinesses.length})</h3>
                                            <button onClick={() => setShowLinks(false)} className="text-slate-400 hover:text-white">✕</button>
                                        </div>
                                        <div className="p-4 flex-1 overflow-hidden flex flex-col">
                                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg mb-4">
                                                <p className="text-yellow-200 text-xs">
                                                    Copia estos enlaces para usarlos en una extensión de Chrome, un bot externo, o simplemente para guardarlos.
                                                    Cada enlace ya contiene el mensaje personalizado y la imagen.
                                                </p>
                                            </div>
                                            <textarea
                                                readOnly
                                                value={generatedLinks}
                                                className="flex-1 w-full bg-[#0b0f1a] border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500 resize-none whitespace-pre"
                                            />
                                        </div>
                                        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedLinks);
                                                    alert('Enlaces copiados al portapapeles');
                                                }}
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
                                            >
                                                Copiar Todo
                                            </button>
                                            <button
                                                onClick={() => setShowLinks(false)}
                                                className="px-4 py-2 text-slate-400 hover:text-white"
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BulkActionPanel;
