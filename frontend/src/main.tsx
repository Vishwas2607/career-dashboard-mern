import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider.tsx'
import { AuthenticationProvider } from './context/AuthenticationProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthenticationProvider>
            <App />
        </AuthenticationProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
