import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReviewedProvider } from './contexts/ReviewedContext';
import { BulkSelectionProvider } from './contexts/BulkSelectionContext';
import BulkActionPanel from './components/BulkActionPanel';
import Home from './pages/Home';
import PanelPage from './pages/PanelPage';

function App() {
    return (
        <ReviewedProvider>
            <BulkSelectionProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/panel" element={<PanelPage />} />
                    </Routes>
                    <BulkActionPanel />
                </Router>
            </BulkSelectionProvider>
        </ReviewedProvider>
    );
}

export default App;
