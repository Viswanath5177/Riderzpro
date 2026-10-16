import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:font-sans",
          description: "group-[.toast]:text-gray-500",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:!bg-gray-100 group-[.toast]:!text-gray-600 hover:group-[.toast]:!text-gray-900 hover:group-[.toast]:!bg-gray-200 group-[.toast]:!border group-[.toast]:!border-gray-200 group-[.toast]:!rounded-full transition",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
