import toast, { Toaster, ToastOptions } from 'react-hot-toast';

/**
 * Toast notification wrapper with custom styling
 */

// Custom toast styles matching the app theme
const toastOptions: ToastOptions = {
    duration: 3000,
    style: {
        background: '#1A1A2E',
        color: '#fff',
        border: '1px solid rgba(0, 255, 255, 0.2)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    success: {
        iconTheme: {
            primary: '#00FF88',
            secondary: '#1A1A2E',
        },
    },
    error: {
        iconTheme: {
            primary: '#FF0055',
            secondary: '#1A1A2E',
        },
    },
};

// Toast utility functions
export const showToast = {
    success: (message: string) => toast.success(message, toastOptions),
    error: (message: string) => toast.error(message, toastOptions),
    loading: (message: string) => toast.loading(message, toastOptions),
    info: (message: string) => toast(message, { ...toastOptions, icon: '💡' }),
    warning: (message: string) => toast(message, { ...toastOptions, icon: '⚠️' }),
    connection: (message: string) => toast(message, { ...toastOptions, icon: '🔗' }),
    dismiss: (toastId?: string) => toast.dismiss(toastId),
};

/**
 * ToastContainer component to be placed at the root of the app
 */
export function ToastContainer() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={toastOptions}
        />
    );
}

export default showToast;
