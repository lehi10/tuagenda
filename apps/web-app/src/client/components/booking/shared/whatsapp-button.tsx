import { cn } from "@/client/lib/utils";

const WhatsAppIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="#25D366"
    className="shrink-0"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.872L.057 23.25a.75.75 0 00.916.916l5.377-1.487A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.7-.5-5.253-1.373l-.369-.214-3.843 1.063 1.063-3.843-.214-.369A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
);

interface WhatsAppButtonProps {
  phone: string;
  justify?: "start" | "center";
  className?: string;
}

export function WhatsAppButton({
  phone,
  justify = "start",
  className,
}: WhatsAppButtonProps) {
  return (
    <a
      href={`https://wa.me/${phone.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 w-full rounded-xl border border-green-200 bg-green-50 p-2.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors",
        justify === "center" && "justify-center",
        className
      )}
    >
      <WhatsAppIcon />
      Hablar por WhatsApp
    </a>
  );
}
