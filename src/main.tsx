
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './global.css'  // Import global.css to apply ContentEditable directives

createRoot(document.getElementById("root")!).render(<App />);
