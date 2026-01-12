import { useState, useMemo } from 'react';
import { openWhatsApp } from '../utils/whatsapp';

const ReviewedPanel = ({
    reviewedBusinesses,
    onToggleReviewed,
    onClearAll,
    onUpdateCategory,
    customCategories,
    onAddCategory,
    onRemoveCategory
}) => {
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [editingBusinessId, setEditingBusinessId] = useState(null);

    // Las categorías ahora vienen de las props, pero agregamos 'Todas' para el filtro
    const filterCategories = useMemo(() => ['Todas', ...customCategories], [customCategories]);

    // Filtrar negocios por categoría seleccionada
    const filteredBusinesses = useMemo(() => {
        if (selectedCategory === 'Todas') return reviewedBusinesses;
        return reviewedBusinesses.filter(b => b.category === selectedCategory);
    }, [reviewedBusinesses, selectedCategory]);

    const handleAddCustomCategory = (e) => {
        e.preventDefault();
        const trimmedName = newCategoryName.trim();
        if (!trimmedName) return;

        // Agregar la categoría globalmente si no existe
        onAddCategory(trimmedName);

        // Si estamos editando un negocio, le asignamos esta categoría
        if (editingBusinessId) {
            onUpdateCategory(editingBusinessId, trimmedName);
            setEditingBusinessId(null);
        }

        setSelectedCategory(trimmedName);
        setNewCategoryName('');
        setShowAddCategory(false);
    };

    const handleRemoveCategory = (e, cat) => {
        e.stopPropagation();
        if (cat === 'General') return;
        if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${cat}"? Los negocios se moverán a "General".`)) {
            onRemoveCategory(cat);
            if (selectedCategory === cat) setSelectedCategory('Todas');
        }
    };

    if (!reviewedBusinesses || reviewedBusinesses.length === 0) {
        return (
            <div className="card p-8 text-center border-dashed border-slate-800 bg-slate-900/20">
                <div className="text-5xl mb-4 opacity-30">📋</div>
                <h3 className="text-lg font-bold text-slate-300 mb-2">Lista de Verificados</h3>
                <p className="text-sm text-slate-500">
                    Aún no has marcado ningún negocio como revisado.
                </p>
            </div>
        );
    }

    return (
        <div className="card flex flex-col h-full bg-[#161e2d] border-slate-800/60 shadow-2xl overflow-hidden max-h-[85vh]">
            {/* Header del Panel */}
            <div className="p-4 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <h3 className="font-bold text-white tracking-wide">VERIFICADOS</h3>
                    <span className="bg-primary-500/20 text-primary-400 text-xs font-bold px-2 py-0.5 rounded-full border border-primary-500/30">
                        {reviewedBusinesses.length}
                    </span>
                </div>
                <button
                    onClick={onClearAll}
                    className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                    title="Borrar todos"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* Filtros de Categoría */}
            <div className="p-3 bg-slate-900/20 border-b border-slate-800/40">
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {filterCategories.map(cat => (
                        <div key={cat} className="relative group/cat">
                            <button
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border pr-6
                                    ${selectedCategory === cat
                                        ? 'bg-primary-600 text-white border-primary-500 shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                                        : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600'}`}
                            >
                                {cat}
                            </button>
                            {cat !== 'Todas' && cat !== 'General' && (
                                <button
                                    onClick={(e) => handleRemoveCategory(e, cat)}
                                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-red-400 p-0.5 opacity-0 group-hover/cat:opacity-100 transition-opacity`}
                                >
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            {/* Adjust padding via class or inline style if needed, but pr-6 is already there. Let's make it conditional in the button class instead for cleaner code. */}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            setShowAddCategory(!showAddCategory);
                            setEditingBusinessId(null);
                        }}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border border-dashed
                            ${showAddCategory ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' : 'bg-slate-800/30 text-slate-500 border-slate-700/30 hover:bg-slate-800/50'}`}
                    >
                        + Nuevo Servicio
                    </button>
                </div>

                {showAddCategory && (
                    <form onSubmit={handleAddCustomCategory} className="mt-2 flex gap-1 animate-fade-in">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nombre del servicio..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-primary-500 outline-none"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                        >
                            Crear
                        </button>
                    </form>
                )}
            </div>

            {/* Lista Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                {filteredBusinesses.length === 0 ? (
                    <p className="text-center text-slate-600 text-xs py-10 italic">
                        No hay negocios en esta categoría.
                    </p>
                ) : (
                    filteredBusinesses.map((business) => (
                        <div
                            key={business.id}
                            className="group bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/20 rounded-xl p-3 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-primary-400 transition-colors">
                                            {business.name}
                                        </h4>
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate mb-2">
                                        {business.address}
                                    </p>

                                    {/* Categoría actual y opción de cambiar */}
                                    <div className="flex items-center gap-1.5">
                                        <select
                                            className="text-[9px] bg-slate-900 text-slate-400 border-none p-0 focus:ring-0 cursor-pointer hover:text-white transition-colors uppercase font-bold outline-none"
                                            value={business.category || 'General'}
                                            onChange={(e) => onUpdateCategory(business.id, e.target.value)}
                                        >
                                            {customCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => {
                                                setEditingBusinessId(business.id);
                                                setShowAddCategory(true);
                                            }}
                                            className="text-[9px] text-slate-600 hover:text-primary-400 transition-colors"
                                            title="Crear Nueva Categoría"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5 flex-shrink-0">
                                    {business.phone && (
                                        <button
                                            onClick={() => openWhatsApp(business.phone, business.name)}
                                            className="p-2 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white rounded-lg transition-all duration-300"
                                            title="WhatsApp"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onToggleReviewed(business)}
                                        className="p-2 bg-red-600/5 hover:bg-red-600/20 text-red-500 rounded-lg transition-all duration-300"
                                        title="Eliminar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-800/60">
                <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold opacity-60">
                    Lead Manager • CRM
                </p>
            </div>
        </div>
    );
};

export default ReviewedPanel;
