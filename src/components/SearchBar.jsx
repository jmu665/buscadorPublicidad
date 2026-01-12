import { useState } from 'react';

const SearchBar = ({ onSearch, isLoading }) => {
    const [businessName, setBusinessName] = useState('');
    const [city, setCity] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!businessName.trim()) {
            newErrors.businessName = 'El nombre del negocio es requerido';
        }

        if (!city.trim()) {
            newErrors.city = 'La ciudad es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSearch(businessName.trim(), city.trim());
        }
    };

    const handleClear = () => {
        setBusinessName('');
        setCity('');
        setErrors({});
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-slide-up">
            <div className="card p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                        🔍 Buscador de Negocios
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Encuentra negocios locales y contáctalos por WhatsApp
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Campo de nombre de negocio */}
                        <div className="space-y-2">
                            <label
                                htmlFor="businessName"
                                className="block text-sm font-semibold text-slate-300 ml-1"
                            >
                                Tipo de Negocio
                            </label>
                            <input
                                id="businessName"
                                type="text"
                                value={businessName}
                                onChange={(e) => {
                                    setBusinessName(e.target.value);
                                    if (errors.businessName) {
                                        setErrors({ ...errors, businessName: '' });
                                    }
                                }}
                                placeholder="ej: Restaurante, Peluquería..."
                                className={`input-field ${errors.businessName ? 'border-red-500/50 ring-2 ring-red-500/10' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.businessName && (
                                <p className="mt-2 text-sm text-red-400 animate-fade-in flex items-center gap-1">
                                    <span className="text-xs">⚠️</span> {errors.businessName}
                                </p>
                            )}
                        </div>

                        {/* Campo de ciudad */}
                        <div className="space-y-2">
                            <label
                                htmlFor="city"
                                className="block text-sm font-semibold text-slate-300 ml-1"
                            >
                                Ciudad
                            </label>
                            <input
                                id="city"
                                type="text"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                    if (errors.city) {
                                        setErrors({ ...errors, city: '' });
                                    }
                                }}
                                placeholder="ej: Madrid, Barcelona..."
                                className={`input-field ${errors.city ? 'border-red-500/50 ring-2 ring-red-500/10' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.city && (
                                <p className="mt-2 text-sm text-red-400 animate-fade-in flex items-center gap-1">
                                    <span className="text-xs">⚠️</span> {errors.city}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 justify-center pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary min-w-[200px] flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Buscando...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Buscar Negocios</span>
                                </>
                            )}
                        </button>

                        {(businessName || city) && !isLoading && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold 
                                 rounded-lg transition-all duration-200 border border-slate-700/50"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchBar;
