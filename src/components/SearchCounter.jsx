import { useSearchCounter } from '../hooks/useSearchCounter';

const SearchCounter = () => {
    const { searchCount, getUsageStats, resetCounter, FREE_TIER_LIMIT, CREDIT_LIMIT } = useSearchCounter();
    const stats = getUsageStats();

    const getStatusColor = () => {
        switch (stats.status) {
            case 'danger':
                return 'bg-red-500';
            case 'warning':
                return 'bg-yellow-500';
            default:
                return 'bg-green-500';
        }
    };

    const getStatusBorder = () => {
        switch (stats.status) {
            case 'danger':
                return 'border-red-500/30 bg-red-500/5';
            case 'warning':
                return 'border-yellow-500/30 bg-yellow-500/5';
            default:
                return 'border-green-500/30 bg-green-500/5';
        }
    };

    const getCurrentMonthName = () => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const now = new Date();
        return `${months[now.getMonth()]} ${now.getFullYear()}`;
    };

    return (
        <div className={`card p-6 border-2 transition-all duration-500 ${getStatusBorder()} animate-fade-in`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                        📊 Uso Mensual
                    </h3>
                    <p className="text-sm text-slate-400">
                        {getCurrentMonthName()}
                    </p>
                </div>
                <button
                    onClick={resetCounter}
                    className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg 
                   transition-all duration-200 text-slate-300 border border-slate-700/50"
                    title="Resetear contador (solo para pruebas)"
                >
                    Resetear
                </button>
            </div>

            {/* Contador principal */}
            <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-4xl font-bold text-white tracking-tight">
                        {searchCount.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-400">búsquedas</span>
                </div>

                {/* Barra de progreso - Nivel gratuito */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>Nivel Gratuito</span>
                        <span className="font-medium text-slate-300">{FREE_TIER_LIMIT.toLocaleString()} búsquedas</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div
                            className={`h-full ${getStatusColor()} transition-all duration-700 ease-out shadow-[0_0_12px_rgba(34,197,94,0.3)]`}
                            style={{ width: `${Math.min(stats.percentageOfFreeTier, 100)}%` }}
                        />
                    </div>
                    {stats.freeTierRemaining > 0 ? (
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            {stats.freeTierRemaining.toLocaleString()} búsquedas gratis restantes
                        </p>
                    ) : (
                        <p className="text-xs text-orange-400 mt-2 font-semibold">
                            ⚠️ Nivel gratuito superado
                        </p>
                    )}
                </div>

                {/* Barra de progreso - Crédito de $200 */}
                {stats.isOverFreeTier && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                            <span>Crédito $200 USD</span>
                            <span className="font-medium text-slate-300">{CREDIT_LIMIT.toLocaleString()} búsquedas</span>
                        </div>
                        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div
                                className={`h-full ${stats.isOverCredit ? 'bg-red-500' : 'bg-blue-500'} transition-all duration-700 ease-out shadow-[0_0_12px_rgba(59,130,246,0.3)]`}
                                style={{ width: `${Math.min(stats.percentageOfCredit, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Estadísticas de costo */}
            <div className="border-t border-slate-800/60 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Costo estimado:</span>
                    <span className={`font-bold ${stats.estimatedCost > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                        ${stats.estimatedCost} USD
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Crédito restante:</span>
                    <span className="font-bold text-green-400 underline decoration-green-500/30 underline-offset-4">
                        ${stats.remainingCredit} USD
                    </span>
                </div>
            </div>

            {/* Alertas */}
            {stats.status === 'warning' && !stats.isOverCredit && (
                <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-300 flex items-start gap-2">
                        <span>⚠️</span>
                        Has superado el nivel gratuito, pero aún estás dentro del crédito de $200/mes.
                    </p>
                </div>
            )}

            {stats.status === 'danger' && (
                <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-300 font-semibold flex items-start gap-2">
                        <span>🚨</span>
                        ¡Alerta! Has superado el crédito mensual de $200. Las siguientes búsquedas tendrán costo adicional.
                    </p>
                </div>
            )}

            {stats.status === 'safe' && searchCount > 0 && (
                <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-300 flex items-start gap-2">
                        <span>✅</span>
                        Estás usando el servicio de forma gratuita.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchCounter;
