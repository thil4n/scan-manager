
import { useToast } from '@/context/ToastContext';
import type { ToastMessage, ToastVariant } from '@/context/ToastContext';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const icons: Record<ToastVariant, typeof CheckCircleIcon> = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const colors: Record<ToastVariant, string> = {
  success: 'text-emerald-400 border-emerald-700/50 bg-emerald-950/60',
  error: 'text-red-400 border-red-700/50 bg-red-950/60',
  warning: 'text-yellow-400 border-yellow-700/50 bg-yellow-950/60',
  info: 'text-blue-400 border-blue-700/50 bg-blue-950/60',
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  const { dismiss } = useToast();
  const Icon = icons[toast.variant];

  return (
    <div
      className={`flex w-80 items-start gap-3 rounded-lg border p-3 shadow-lg backdrop-blur ${colors[toast.variant]}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 text-sm">
        <p className="font-medium text-white">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs opacity-80">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => dismiss(toast.id)}
        className="ml-auto shrink-0 text-gray-500 hover:text-gray-300"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
