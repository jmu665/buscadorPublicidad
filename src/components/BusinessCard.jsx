import { openWhatsApp } from '../utils/whatsapp';

const BusinessCard = ({ business, isReviewed = false, onToggleReviewed }) => {
    const {
        id,
        name,
        address,
        phone,
        rating,
        ratingCount,
        mapsUrl,
        photoUrl,
    } = business;

    const handleWhatsAppClick = () => {
        if (phone) {
            openWhatsApp(phone, name);
        }
    };

    const renderStars = (rating) => {
        if (!rating) return null;

        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <svg key={i} className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id="half">
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="#D1D5DB" stopOpacity="1" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            }
        }

        return stars;
    };

    return (
        <div className={`card group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-scale-in ${isReviewed ? 'ring-2 ring-green-500/50 bg-[#1e293b]' : ''}`}>
            {/* Imagen */}
            <div className="relative h-48 bg-slate-800 overflow-hidden">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                            e.target.parentElement.innerHTML = '<div class="text-6xl filter grayscale opacity-50">🏪</div>';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-slate-800 text-slate-700">
                        🏪
                    </div>
                )}

                {/* Badge de revisado */}
                {isReviewed && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full 
                         flex items-center gap-1 shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-scale-in z-10 text-xs font-bold">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Revisado</span>
                    </div>
                )}

                {/* Botón de check */}
                <button
                    onClick={() => onToggleReviewed && onToggleReviewed(id, name)}
                    className={`absolute top-3 left-3 w-10 h-10 rounded-full shadow-lg 
                     transition-all duration-300 flex items-center justify-center z-10 backdrop-blur-sm
                     ${isReviewed
                            ? 'bg-green-500 text-white shadow-green-500/20'
                            : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'
                        } hover:scale-110 active:scale-95`}
                    title={isReviewed ? 'Marcar como no revisado' : 'Marcar como revisado'}
                >
                    {isReviewed ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#161e2d] to-transparent"></div>
            </div>

            {/* Contenido */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
                    {name}
                </h3>

                {/* Rating */}
                {rating && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex scale-90 -ml-1">
                            {renderStars(rating)}
                        </div>
                        <span className="text-xs font-medium text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
                            {rating.toFixed(1)} <span className="text-slate-500 ml-1">({ratingCount})</span>
                        </span>
                    </div>
                )}

                <div className="space-y-3 mb-6">
                    {/* Dirección */}
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                            {address}
                        </p>
                    </div>

                    {/* Teléfono */}
                    {phone && (
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-primary-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <p className="text-sm text-slate-200 font-semibold tracking-wide">
                                {phone}
                            </p>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 mt-auto">
                    {phone && (
                        <button
                            onClick={handleWhatsAppClick}
                            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold 
                       rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                       shadow-[0_4px_12px_rgba(22,163,74,0.2)] hover:shadow-[0_8px_20px_rgba(22,163,74,0.3)] 
                       transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            WhatsApp
                        </button>
                    )}

                    {mapsUrl && (
                        <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${phone ? '' : 'w-full'} px-4 py-3 bg-slate-800 hover:bg-slate-700 
                       text-slate-200 font-bold rounded-lg transition-all duration-300
                       flex items-center justify-center gap-2 border border-slate-700/50
                       hover:border-slate-600 transform hover:-translate-y-0.5 active:translate-y-0 text-sm`}
                        >
                            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {phone ? 'Maps' : 'Ver en Maps'}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessCard;
