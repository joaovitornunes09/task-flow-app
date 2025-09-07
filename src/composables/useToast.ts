import { toast } from "vue-sonner";

export function useToast() {
  return {
    success: (msg: string, description?: string) =>
      toast.success(msg, { description, duration: 3000 }),

    error: (msg: string, description?: string) =>
      toast.error(msg, { description, duration: 5000 }),

    info: (msg: string, description?: string) =>
      toast.info(msg, { description, duration: 4000 }),

    warning: (msg: string, description?: string) =>
      toast.warning(msg, { description, duration: 4000 }),

    loading: (msg: string) => toast.loading(msg),

    dismiss: (id?: string | number) => toast.dismiss(id),

    promise: <T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: any) => string);
      }
    ) => toast.promise(promise, messages),
  };
}
