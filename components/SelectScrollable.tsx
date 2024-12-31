import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectScrollable() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Izberi storitev" />
      </SelectTrigger>
      <SelectContent>
        {/* Quick Service (Hitri servis) */}
        <SelectGroup>
          <SelectLabel>Hitri servis</SelectLabel>
          <SelectItem value="oil_change">Menjava olja</SelectItem>
          <SelectItem value="filter_change">Menjava filtrov</SelectItem>
          <SelectItem value="fluid_top_up">Dopolnitev tekočin</SelectItem>
          <SelectItem value="battery_check">Preverjanje akumulatorja</SelectItem>
        </SelectGroup>

        {/* Tire Services (Vulkanizerstvo) */}
        <SelectGroup>
          <SelectLabel>Vulkanizerstvo</SelectLabel>
          <SelectItem value="tire_fitting">Montaza pnevmatik</SelectItem>
          <SelectItem value="tire_balancing">Uravnoteženje pnevmatik</SelectItem>
          <SelectItem value="tire_repair">Popravilo pnevmatik</SelectItem>
          <SelectItem value="wheel_alignment">Geometrija koles</SelectItem>
        </SelectGroup>

        {/* Repairs (Popravila) */}
        <SelectGroup>
          <SelectLabel>Popravila</SelectLabel>
          <SelectItem value="brake_repair">Popravilo zavor</SelectItem>
          <SelectItem value="engine_repair">Popravilo motorja</SelectItem>
          <SelectItem value="suspension_repair">Popravilo vzmetenja</SelectItem>
          <SelectItem value="exhaust_repair">Popravilo izpušnega sistema</SelectItem>
        </SelectGroup>

        {/* Diagnostics (Diagnostika) */}
        <SelectGroup>
          <SelectLabel>Diagnostika</SelectLabel>
          <SelectItem value="electrical_diagnostics">Električna diagnostika</SelectItem>
          <SelectItem value="engine_diagnostics">Diagnostika motorja</SelectItem>
          <SelectItem value="air_conditioning_diagnostics">Diagnostika klimatske naprave</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
