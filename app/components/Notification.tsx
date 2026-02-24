"use client";

import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface NotificationProps {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  show,
  type,
  title,
  message,
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 ${
            type === 'success' ? 'bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/30' : 'bg-red-500/10 backdrop-blur-sm border border-red-500/30'
          }`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {type === 'success' ? (
                    <CheckCircleIcon className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <ExclamationCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className={`text-sm font-medium ${
                    type === 'success' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {title}
                  </p>
                  {message && (
                    <p className="mt-1 text-sm text-gray-400">
                      {message}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`inline-flex rounded-md ${
                      type === 'success' ? 'text-emerald-500 hover:text-emerald-400' : 'text-red-500 hover:text-red-400'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                  >
                    <span className="sr-only">Закрыть</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};