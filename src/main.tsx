
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add custom styles for scrollbar hiding
const style = document.createElement('style');
style.textContent = `
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
