import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  loading?: boolean;
  className?: string;
  footer?: React.ReactNode;
  showFooter?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  variant?: 'default' | 'destructive' | 'warning';
}

const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  loading = false,
  className = "",
  footer,
  showFooter = false,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  confirmLoading = false,
  confirmDisabled = false,
  variant = 'default'
}) => {
  // Gestion de la touche Escape
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Empêcher le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-md';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'border-red-200 dark:border-red-800';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'w-full',
          getSizeClasses(),
          getVariantClasses(),
          className
        )}
        onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <DialogHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {title && (
                  <DialogTitle className="text-lg sm:text-xl font-semibold text-left">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 text-left mt-1">
                    {description}
                  </DialogDescription>
                )}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-4 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>
        )}

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chargement...
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {(showFooter || footer) && (
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            {footer ? (
              footer
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading || confirmLoading}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  {cancelLabel}
                </Button>
                {onConfirm && (
                  <Button
                    onClick={handleConfirm}
                    disabled={loading || confirmLoading || confirmDisabled}
                    variant={variant === 'destructive' ? 'destructive' : 'default'}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    {confirmLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {confirmLabel}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveModal;