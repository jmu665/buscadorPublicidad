import BusinessCard from './BusinessCard';

const ResultsList = ({ businesses, isLoading, error, searchPerformed, isReviewed, onToggleReviewed, hasMore, isLoadingMore, onLoadMore }) => {
    // Estado de carga
    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce">
                            🔍
                        </div>
                    </div>
                    <p className="text-xl text-slate-300 font-medium tracking-wide">
                        Buscando negocios...
                    </p>
                </div>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 py-12">
                <div className="card p-8 bg-red-500/5 border-red-500/20">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-red-500/10 p-2 rounded-lg">
                            <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-1">
                                Error al buscar negocios
                            </h3>
                            <p className="text-red-300/80">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Sin resultados
    if (searchPerformed && businesses.length === 0) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 py-12">
                <div className="card p-16 text-center border-dashed border-slate-800">
                    <div className="text-7xl mb-6 filter grayscale opacity-60">😕</div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                        No se encontraron resultados
                    </h3>
                    <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                        Intenta con otros términos de búsqueda o verifica la ortografía de la ciudad.
                    </p>
                </div>
            </div>
        );
    }

    // Estado inicial (sin búsqueda realizada)
    if (!searchPerformed) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 py-20">
                <div className="text-center">
                    <div className="text-8xl mb-6 filter drop-shadow-[0_0_20px_rgba(14,165,233,0.2)] animate-pulse">🚀</div>
                    <p className="text-xl text-slate-400 font-medium">
                        Comienza buscando el tipo de negocio y la ciudad
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                        Potencia tu estrategia de marketing con AgendaApp 360
                    </p>
                </div>
            </div>
        );
    }

    // Resultados
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            {/* Encabezado de resultados */}
            <div className="mb-10 flex items-center justify-between border-b border-slate-800/60 pb-6 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        Resultados de búsqueda
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Explora los leads encontrados para tu negocio
                    </p>
                </div>
                <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
                    <p className="text-slate-300 text-sm font-medium">
                        <span className="text-primary-400 font-bold mr-1">{businesses.length}</span> negocios
                    </p>
                </div>
            </div>

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {businesses.map((business, index) => (
                    <div
                        key={business.id || index}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <BusinessCard
                            business={business}
                            isReviewed={isReviewed(business.id)}
                            onToggleReviewed={onToggleReviewed}
                        />
                    </div>
                ))}
            </div>

            {/* Botón de Cargar Más */}
            {hasMore && !isLoadingMore && (
                <div className="mt-12 text-center animate-fade-in group">
                    <button
                        onClick={onLoadMore}
                        className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold 
                     rounded-xl transition-all duration-300 border border-slate-700/50
                     shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                     transform hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto"
                    >
                        <svg className="w-5 h-5 text-primary-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Cargar más resultados
                    </button>
                    <p className="text-xs text-slate-500 mt-4 uppercase tracking-widest font-semibold opacity-60">
                        Mostrando {businesses.length} resultados
                    </p>
                </div>
            )}

            {/* Loading más resultados */}
            {isLoadingMore && (
                <div className="mt-12 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-400 font-medium">
                        Cargando más resultados...
                    </p>
                </div>
            )}

            {/* No hay más resultados */}
            {!hasMore && businesses.length > 0 && (
                <div className="mt-12 text-center animate-fade-in">
                    <p className="text-slate-500 flex items-center justify-center gap-2">
                        <span className="w-8 h-px bg-slate-800"></span>
                        ✨ Has visto todos los resultados disponibles ({businesses.length})
                        <span className="w-8 h-px bg-slate-800"></span>
                    </p>
                </div>
            )}

            {/* Nota sobre WhatsApp */}
            {businesses.some(b => !b.phone) && (
                <div className="mt-12 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-xl animate-fade-in">
                    <div className="flex items-start gap-4">
                        <div className="bg-yellow-500/10 p-2 rounded-lg flex-shrink-0">
                            <svg
                                className="w-5 h-5 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-yellow-200/70 leading-relaxed">
                            <strong className="text-yellow-400 block mb-1">Nota sobre disponibilidad:</strong>
                            Algunos negocios no tienen WhatsApp disponible porque no han publicado su número de teléfono en Google Maps. Te recomendamos buscarlos en redes sociales si el contacto es prioritario.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsList;
