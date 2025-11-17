"use client";

import { useState, useEffect } from "react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Textarea } from "@/client/components/ui/textarea";
import { Label } from "@/client/components/ui/label";
import { Switch } from "@/client/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/client/components/ui/dialog";
import type { ServiceData, ServiceFormData } from "../types";

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: ServiceData | null;
  categoryName: string;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ServiceFormModal({
  open,
  onOpenChange,
  service,
  categoryName,
  onSubmit,
  isSubmitting,
}: ServiceFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");

  const isEditing = !!service;

  useEffect(() => {
    if (open) {
      if (service) {
        setName(service.name);
        setDescription(service.description || "");
        setPrice(service.price.toString());
        const h = Math.floor(service.durationMinutes / 60);
        const m = service.durationMinutes % 60;
        setHours(h > 0 ? h.toString() : "");
        setMinutes(m > 0 ? m.toString() : "");
        setActive(service.active);
      } else {
        setName("");
        setDescription("");
        setPrice("");
        setHours("");
        setMinutes("30");
        setActive(true);
      }
      setError("");
    }
  }, [open, service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("El precio debe ser un numero valido");
      return;
    }

    const hoursNum = hours ? parseInt(hours, 10) : 0;
    const minutesNum = minutes ? parseInt(minutes, 10) : 0;
    const totalMinutes = hoursNum * 60 + minutesNum;

    if (totalMinutes <= 0) {
      setError("La duracion debe ser mayor a 0");
      return;
    }

    if (totalMinutes > 1440) {
      setError("La duracion no puede exceder 24 horas");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        price: priceNum,
        durationMinutes: totalMinutes,
        active,
      });
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al guardar el servicio");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Servicio" : "Nuevo Servicio"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Categoria: <span className="font-medium">{categoryName}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">Nombre *</Label>
            <Input
              id="service-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Corte clasico"
              maxLength={255}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-description">Descripcion</Label>
            <Textarea
              id="service-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripcion opcional del servicio"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-price">Precio *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="service-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="pl-7"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duracion *</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    horas
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="30"
                    disabled={isSubmitting}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Estado</Label>
              <p className="text-xs text-muted-foreground">
                Los servicios inactivos no se muestran a clientes
              </p>
            </div>
            <Switch
              checked={active}
              onCheckedChange={setActive}
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
