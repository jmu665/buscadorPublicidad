import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ResultsList from '../components/ResultsList';
import SearchCounter from '../components/SearchCounter';
import ReviewedPanel from '../components/ReviewedPanel';
import { searchBusinesses } from '../services/placesService';
import { useSearchCounter } from '../hooks/useSearchCounter';
import { useReviewedBusinesses } from '../hooks/useReviewedBusinesses';
import { Link } from 'react-router-dom';

function Home() {
    const [businesses, setBusinesses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [currentSearchParams, setCurrentSearchParams] = useState({ businessName: '', city: '' });
    const { incrementCounter } = useSearchCounter();
    const {
        isReviewed,
        toggleReviewed,
        reviewedBusinesses,
        clearReviewed,
        updateCategory,
        customCategories,
        addCustomCategory,
        removeCustomCategory
    } = useReviewedBusinesses();

    const handleSearch = async (businessName, city) => {
        setIsLoading(true);
        setError(null);
        setSearchPerformed(true);
        setBusinesses([]);
        setNextPageToken(null);
        setCurrentSearchParams({ businessName, city });

        try {
            const result = await searchBusinesses(businessName, city);
            setBusinesses(result.businesses);
            setNextPageToken(result.nextPageToken);
            incrementCounter();
        } catch (err) {
            setError(err.message);
            setBusinesses([]);
            setNextPageToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = async () => {
        if (!nextPageToken || isLoadingMore) return;

        setIsLoadingMore(true);
        setError(null);

        try {
            const result = await searchBusinesses(
                currentSearchParams.businessName,
                currentSearchParams.city,
                nextPageToken
            );

            setBusinesses(prev => [...prev, ...result.businesses]);
            setNextPageToken(result.nextPageToken);
            incrementCounter();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-500">
            {/* Header */}
            <header className="bg-[#161e2d]/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]">📍</div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-100">
                                Business Finder
                            </h1>
                            <p className="text-sm text-slate-400">
                                Encuentra y contacta negocios locales
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/panel"
                        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-primary-900/20"
                    >
                        Ir al Panel ✅
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4">
                {/* Contador de búsquedas */}
                <div className="w-full max-w-md mx-auto py-6">
                    <SearchCounter />
                </div>

                <SearchBar onSearch={handleSearch} isLoading={isLoading} />

                <div className="mt-8">
                    {/* Panel de Resultados (Ancho completo) */}
                    <div className="w-full">
                        <ResultsList
                            businesses={businesses}
                            isLoading={isLoading}
                            error={error}
                            searchPerformed={searchPerformed}
                            isReviewed={isReviewed}
                            onToggleReviewed={toggleReviewed}
                            hasMore={!!nextPageToken}
                            isLoadingMore={isLoadingMore}
                            onLoadMore={handleLoadMore}
                            customCategories={customCategories}
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-16 py-12 bg-[#161e2d] border-t border-slate-800/60">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-300 font-medium mb-2">
                        Desarrollado con ❤️ usando React y Google Places API
                    </p>
                    <p className="text-sm text-slate-500">
                        Conecta con negocios locales de forma instantánea • CRM Lead Manager
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
