import { toast } from 'react-toastify';

export class NotificationController {
    static showWarning(message: string) {
        toast.warn(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            // draggable: true,
            progress: undefined,
            // theme: "light",
        });
    }
    static showSuccess(message: string) {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            // draggable: true,
            progress: undefined,
            // theme: "light",
        });
    }
    static showError(message: string) {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            // draggable: true,
            progress: undefined,
            // theme: "light",
        });
    }
}