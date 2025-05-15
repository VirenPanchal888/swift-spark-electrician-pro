
import {
  type ToastProps,
  type ToastActionElement,
} from "@/components/ui/toast"

import {
  useToast as useToastPrimitive,
  toast as toastPrimitive
} from "@/components/ui/toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export const toast = toastPrimitive
export const useToast = useToastPrimitive
