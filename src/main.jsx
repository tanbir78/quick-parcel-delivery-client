import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import { router } from './router/Router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AuthProvider from './contexts/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

AOS.init();
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <div className='urbanist max-w-7xl mx-auto'>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        {/* <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#063B3D",
          },
        }}
      /> */}
      </AuthProvider>
    </QueryClientProvider>
  </div>
)
