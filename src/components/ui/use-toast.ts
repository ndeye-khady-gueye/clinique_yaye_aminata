import { toast as sonnerToast } from 'sonner';

export const toast = ({
  title,
  description,
  variant = 'default',
}: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}) => {
  if (variant === 'destructive') {
    sonnerToast.error(title, {
      description,
    });
  } else if (variant === 'success') {
    sonnerToast.success(title, {
      description,
    });
  } else {
    sonnerToast(title, {
      description,
    });
  }
};
