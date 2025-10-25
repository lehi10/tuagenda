"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n"

interface TimeSlot {
  time: string
  available: boolean
}

interface TimeSlotSelectionProps {
  timeSlots: TimeSlot[]
  selectedSlot?: string
  onSelect: (slot: string) => void
}

export function TimeSlotSelection({
  timeSlots,
  selectedSlot,
  onSelect,
}: TimeSlotSelectionProps) {
  const { t } = useTranslation()

  const availableSlots = timeSlots.filter((slot) => slot.available)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t.booking.time.title}</h2>
      </div>

      {availableSlots.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {t.booking.time.noSlots}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {availableSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={selectedSlot === slot.time ? "default" : "outline"}
              onClick={() => onSelect(slot.time)}
              className="h-12"
            >
              {slot.time}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
