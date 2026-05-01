"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/client/components/ui/field";
import { useTrpc } from "@/client/lib/trpc";
import { SUPPORTED_TIMEZONES } from "@/client/lib/timezone-utils";
import type { Business } from "@/shared/types/business";

const schema = z.object({
  timeZone: z.string().min(1, "La zona horaria es requerida"),
  locale: z.string().min(1, "El idioma es requerido"),
  currency: z.string().min(1, "La moneda es requerida"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  business: Business;
  onUpdate?: () => void;
}

export function RegionalizationSection({ business, onUpdate }: Props) {
  const updateMutation = useTrpc.business.update.useMutation({
    onSuccess: () => {
      toast.success("Configuración regional actualizada");
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar");
    },
  });

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      timeZone: business.timeZone,
      locale: business.locale,
      currency: business.currency,
    },
  });

  const timeZone = watch("timeZone");
  const locale = watch("locale");
  const currency = watch("currency");

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({ id: business.id!, ...data });
  };

  const isLoading = updateMutation.isPending;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Regionalización</CardTitle>
            <CardDescription>
              Zona horaria, idioma y moneda predeterminados del negocio
            </CardDescription>
          </div>
          <Button
            type="submit"
            form="regionalization-form"
            disabled={isLoading}
            size="sm"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form
          id="regionalization-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
        >
          <Field>
            <FieldLabel>
              Zona horaria <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={timeZone}
              onValueChange={(v) => setValue("timeZone", v)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una zona horaria" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{errors.timeZone?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>
                Idioma <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={locale}
                onValueChange={(v) => setValue("locale", v)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{errors.locale?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>
                Moneda <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={currency}
                onValueChange={(v) => setValue("currency", v)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Norteamérica</SelectLabel>
                    <SelectItem value="USD">
                      USD — Dólar estadounidense ($)
                    </SelectItem>
                    <SelectItem value="CAD">
                      CAD — Dólar canadiense (CA$)
                    </SelectItem>
                    <SelectItem value="MXN">MXN — Peso mexicano ($)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Latinoamérica</SelectLabel>
                    <SelectItem value="ARS">
                      ARS — Peso argentino ($)
                    </SelectItem>
                    <SelectItem value="BOB">BOB — Boliviano (Bs)</SelectItem>
                    <SelectItem value="BRL">
                      BRL — Real brasileño (R$)
                    </SelectItem>
                    <SelectItem value="CLP">CLP — Peso chileno ($)</SelectItem>
                    <SelectItem value="COP">
                      COP — Peso colombiano ($)
                    </SelectItem>
                    <SelectItem value="CRC">
                      CRC — Colón costarricense (₡)
                    </SelectItem>
                    <SelectItem value="DOP">
                      DOP — Peso dominicano ($)
                    </SelectItem>
                    <SelectItem value="GTQ">GTQ — Quetzal (Q)</SelectItem>
                    <SelectItem value="HNL">HNL — Lempira (L)</SelectItem>
                    <SelectItem value="NIO">NIO — Córdoba (C$)</SelectItem>
                    <SelectItem value="PAB">PAB — Balboa (B/.)</SelectItem>
                    <SelectItem value="PEN">PEN — Sol peruano (S/)</SelectItem>
                    <SelectItem value="PYG">PYG — Guaraní (₲)</SelectItem>
                    <SelectItem value="UYU">UYU — Peso uruguayo ($)</SelectItem>
                    <SelectItem value="VES">VES — Bolívar (Bs.S)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Europa</SelectLabel>
                    <SelectItem value="EUR">EUR — Euro (€)</SelectItem>
                    <SelectItem value="GBP">
                      GBP — Libra esterlina (£)
                    </SelectItem>
                    <SelectItem value="CHF">
                      CHF — Franco suizo (CHF)
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Otros</SelectLabel>
                    <SelectItem value="AUD">
                      AUD — Dólar australiano (A$)
                    </SelectItem>
                    <SelectItem value="NZD">
                      NZD — Dólar neozelandés (NZ$)
                    </SelectItem>
                    <SelectItem value="JPY">JPY — Yen (¥)</SelectItem>
                    <SelectItem value="CNY">CNY — Yuan (¥)</SelectItem>
                    <SelectItem value="KRW">KRW — Won (₩)</SelectItem>
                    <SelectItem value="INR">INR — Rupia india (₹)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError>{errors.currency?.message}</FieldError>
            </Field>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
