import { useState, useMemo } from 'react';
import { useReviewed } from '../contexts/ReviewedContext';
import { openWhatsApp } from '../utils/whatsapp';
import { Link } from 'react-router-dom';

const PanelPage = () => {
    const {
        reviewedBusinesses,
        customCategories,
        toggleReviewed,
        updateCategory,
        updateStatus,
        addCustomCategory,
        removeCustomCategory,
        clearReviewed,
        isLoading,
        firebaseError
    } = useReviewed();

    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedCity, setSelectedCity] = useState('Todas');
    const [genreSearch, setGenreSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const statusOptions = [
        { id: 'waiting', label: 'Esperando respuesta', color: 'bg-amber-500', text: 'text-amber-500' },
        { id: 'stopped', label: 'Ya no hay seguimiento', color: 'bg-red-500', text: 'text-red-500' },
        { id: 'completed', label: 'Concluido', color: 'bg-green-500', text: 'text-green-500' }
    ];

    const filterCategories = useMemo(() => ['Todas', ...customCategories], [customCategories]);

    const filterCities = useMemo(() => {
        const cities = reviewedBusinesses
            .map(b => b.city)
            .filter(city => city && city.trim() !== '');
        return ['Todas', ...new Set(cities)];
    }, [reviewedBusinesses]);

    const filteredBusinesses = useMemo(() => {
        let filtered = reviewedBusinesses;

        if (selectedCategory !== 'Todas') {
            filtered = filtered.filter(b => b.category === selectedCategory);
        }

        if (selectedCity !== 'Todas') {
            filtered = filtered.filter(b => b.city === selectedCity);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.name.toLowerCase().includes(query) ||
                (b.address && b.address.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [reviewedBusinesses, selectedCategory, selectedCity, searchQuery]);

    const filteredGenres = useMemo(() => {
        if (!genreSearch.trim()) return filterCategories;
        return filterCategories.filter(cat =>
            cat.toLowerCase().includes(genreSearch.toLowerCase())
        );
    }, [filterCategories, genreSearch]);

    const handleCreateGenre = () => {
        const trimmed = genreSearch.trim();
        if (!trimmed) return;
        if (!customCategories.includes(trimmed)) {
            addCustomCategory(trimmed);
        }
        setSelectedCategory(trimmed);
        setGenreSearch('');
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-12">
            {/* Header */}
            <header className="bg-[#161e2d]/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase tracking-wider">
                                    Panel de Control
                                </h1>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Nube Active</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-primary-400 font-black uppercase tracking-[0.2em]">
                                Gestión de Leads Verificados
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Leads</span>
                            <span className="text-lg font-black text-white">{reviewedBusinesses.length}</span>
                        </div>
                        <button
                            onClick={clearReviewed}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 border border-red-500/20 group"
                            title="Borrar todo"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {firebaseError && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 animate-pulse">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <h3 className="text-red-400 font-bold uppercase tracking-wider text-xs">Error de Base de Datos</h3>
                            <p className="text-red-300/80 text-sm">
                                {firebaseError}. Asegúrate de haber activado las <b>Rules (Reglas)</b> en tu consola de Firebase Firestore para permitir lectura/escritura.
                            </p>
                        </div>
                    </div>
                )}

                {/* Search and Filters Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
                    {/* Search & City Filter */}
                    <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-3">
                                    Buscar en Listado
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Nombre o dirección..."
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary-500/50 outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-3">
                                    Filtrar por Ciudad
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">📍</span>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {filterCities.map(city => (
                                            <option key={city} value={city} className="bg-[#161e2d]">
                                                {city.charAt(0).toUpperCase() + city.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Genre Filter & Custom Create */}
                    <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
                                Filtrar por Género / Crear Nuevo
                            </label>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={genreSearch}
                                    onChange={(e) => setGenreSearch(e.target.value)}
                                    placeholder="Buscar o escribir nuevo género..."
                                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-4 pr-32 text-sm focus:border-primary-500/50 outline-none transition-all placeholder:text-slate-600"
                                />
                                {genreSearch.trim() && !filterCategories.some(c => c.toLowerCase() === genreSearch.toLowerCase()) && (
                                    <button
                                        onClick={handleCreateGenre}
                                        className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-primary-900/20"
                                    >
                                        Crear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Genre Chips */}
                        <div className="flex flex-wrap gap-2 mt-4 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                            {filteredGenres.map(cat => (
                                <div key={cat} className="group relative">
                                    <button
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border
                                            ${selectedCategory === cat
                                                ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-900/20'
                                                : 'bg-slate-800/40 text-slate-400 border-slate-700/40 hover:border-slate-600'}`}
                                    >
                                        {cat}
                                    </button>
                                    {cat !== 'Todas' && cat !== 'General' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`¿Eliminar género "${cat}"?`)) {
                                                    removeCustomCategory(cat);
                                                    if (selectedCategory === cat) setSelectedCategory('Todas');
                                                }
                                            }}
                                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-10"
                                        >
                                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Businesses List (List View) */}
                <div className="space-y-4">
                    <div className="hidden md:grid md:grid-cols-12 px-6 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <div className="col-span-3">Negocio / Cliente</div>
                        <div className="col-span-2">Género</div>
                        <div className="col-span-3">Estatus Seguimiento</div>
                        <div className="col-span-2">Contacto</div>
                        <div className="col-span-2 text-right">Acciones</div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/10 rounded-3xl border border-slate-800/40">
                            <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Sincronizando con la nube...</p>
                        </div>
                    ) : filteredBusinesses.length === 0 ? (
                        <div className="text-center py-24 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800/60">
                            <div className="text-6xl mb-6 opacity-10">📁</div>
                            <h3 className="text-xl font-bold text-slate-500 mb-2">No hay registros</h3>
                            <p className="text-slate-600 text-sm">Cambia los filtros o busca en otra categoría</p>
                        </div>
                    ) : (
                        filteredBusinesses.map(business => {
                            const currentStatus = statusOptions.find(s => s.id === (business.status || 'waiting'));

                            return (
                                <div
                                    key={business.id}
                                    className="bg-[#161e2d] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 md:p-6 transition-all group hover:bg-[#1c2636] shadow-xl"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                                        {/* Name & Address */}
                                        <div className="md:col-span-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-base font-bold text-white group-hover:text-primary-400 transition-colors truncate">
                                                    {business.name}
                                                </h4>
                                                {business.city && (
                                                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold uppercase tracking-tighter">
                                                        {business.city}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-1 italic">
                                                {business.address || 'Sin dirección'}
                                            </p>
                                        </div>

                                        {/* Category Select */}
                                        <div className="md:col-span-2">
                                            <div className="inline-flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800 w-full md:w-auto">
                                                <select
                                                    className="bg-transparent text-[10px] font-black text-slate-400 uppercase tracking-widest outline-none cursor-pointer w-full"
                                                    value={business.category || 'General'}
                                                    onChange={(e) => updateCategory(business.id, e.target.value)}
                                                >
                                                    {customCategories.map(cat => (
                                                        <option key={cat} value={cat} className="bg-[#161e2d] text-white py-2">{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Status Select */}
                                        <div className="md:col-span-3">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border w-full md:w-auto transition-all ${currentStatus?.color.replace('bg-', 'bg-').replace('500', '500/10')} ${currentStatus?.color.replace('bg-', 'border-').replace('500', '500/20')}`}>
                                                <div className={`w-2 h-2 rounded-full ${currentStatus?.color} animate-pulse`}></div>
                                                <select
                                                    className={`bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer w-full ${currentStatus?.text}`}
                                                    value={business.status || 'waiting'}
                                                    onChange={(e) => updateStatus(business.id, e.target.value)}
                                                >
                                                    {statusOptions.map(opt => (
                                                        <option key={opt.id} value={opt.id} className="bg-[#161e2d] text-white py-2">
                                                            {opt.label.toUpperCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Phone / WhatsApp */}
                                        <div className="md:col-span-2">
                                            {business.phone ? (
                                                <button
                                                    onClick={() => openWhatsApp(business.phone, business.name)}
                                                    className="flex items-center gap-3 text-green-500 hover:text-green-400 transition-colors group/btn"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover/btn:bg-green-500/20">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs font-bold tracking-tight">{business.phone}</span>
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest bg-slate-800/30 px-3 py-1.5 rounded-lg border border-slate-800">
                                                    Sin Teléfono
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Delete */}
                                        <div className="md:col-span-2 text-right">
                                            <button
                                                onClick={() => toggleReviewed(business)}
                                                className="p-2.5 rounded-xl bg-slate-800/50 text-slate-500 hover:bg-red-500/10 hover:text-red-500 border border-slate-700/50 hover:border-red-500/30 transition-all group/del"
                                                title="Eliminar de la lista"
                                            >
                                                <svg className="w-5 h-5 group-hover/del:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            ` }} />
        </div>
    );
};

export default PanelPage;

