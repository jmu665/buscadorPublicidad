import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReviewedProvider } from './contexts/ReviewedContext';
import Home from './pages/Home';
import PanelPage from './pages/PanelPage';

function App() {
    return (
        <ReviewedProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/panel" element={<PanelPage />} />
                </Routes>
            </Router>
        </ReviewedProvider>
    );
}

export default App;
