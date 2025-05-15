
import {
  type ToastProps,
  type ToastActionElement,
} from "@/components/ui/toast";

import { toast } from "sonner";

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const useToast = () => {
  return {
    toast,
    dismiss: toast.dismiss,
  };
};

export { toast };
