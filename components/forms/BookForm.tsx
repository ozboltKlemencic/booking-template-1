"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import {  z } from "zod"
import { Toaster } from "@/components/ui/toaster"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { delovneUreMehanika } from "@/lib/actions"
import React, { useState } from 'react';

import { Input } from "@/components/ui/input"
import Image from "next/image"


const FormSchema = z.object({
    datumRezervacije: z.date({
        required_error: "Datum termina je obvezen",
    }),
    ime: z.string()
        .nonempty("Ime je obvezno")  
        .min(2, "Ime mora imeti vsaj 2 znaka"),
    priimek: z.string()
        .nonempty("Ime je obvezno")  
        .min(2, "Ime mora imeti vsaj 2 znaka"),
    email: z.string()
        .nonempty("Ime je obvezno")  
        .min(2, "Ime mora imeti vsaj 2 znaka")
        .email(), 
    mehaniki: z.string(),
    ura: z.enum(["10", "11", "12", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"], {
        required_error: "označi uro termina.",
    }),
    storitve: z.string({
        required_error: "Izberi storitev.",
    })
})

export default function BookForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

 

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      variant: "default",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const handleMehanikChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    
    try {
      // Await the result of the Promise
      const delovneUre = await delovneUreMehanika(selectedValue);
      setWorkingHours(delovneUre); // Update state with the working hours
    } catch (error) {
      console.error("Error fetching working hours:", error);
    }
  };
  
  const [workingHours, setWorkingHours] = useState<number[]>([]);
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Naroči se</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Naroči se na popravilo</DialogTitle>
          <DialogDescription>
            Izpolni obrazec.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4 justify-between ">
                {/* Ime */}
                <FormField
                    control={form.control}
                    name="ime"
                    render={({ field }) => (
                        <FormItem className=" flex flex-1 flex-col">
                        <FormControl className="w-full">
                            <Input {...field} value={field.value ?? ""}  placeholder="Ime" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Priimek */}
                <FormField
                    control={form.control}
                    name="priimek"
                    render={({ field }) => (
                        <FormItem className="flex flex-1 flex-col">
                        <FormControl className="w-full">
                            <Input {...field} value={field.value ?? ""}  placeholder="Priimek" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* email */}
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                    <FormControl className="w-full">
                        <Input {...field} value={field.value ?? ""}  placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {/* mehaniki */}
            <FormField
                control={form.control}
                name="mehaniki"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Izberi mehanika</FormLabel>
                        <fieldset className="radio-input">
                            <label className="label">
                                <input
                                    {...field}  
                                    type="radio"
                                    value="1"
                                    checked={field.value === "1"}  
                                    required
                                    onChange={(e) => {
                                      field.onChange(e.target.value);  // Update react-hook-form state
                                      handleMehanikChange(e);  // Call your custom function
                                    }}  
                                />
                                <div className="label-r">
                                    <Image
                                        src="/assets/images/mechanic.png"
                                        width="60"
                                        height="60"
                                        className="icon-avatar"
                                        alt="Mehanik 1"
                                    />
                                    <p className="text">Niko Kogovšek</p>
                                </div>
                            </label>

                            <label className="label">
                                <input
                                    {...field}  
                                    type="radio"
                                    value="2"
                                    checked={field.value === "2"}  
                                    required
                                    onChange={(e) => {
                                      field.onChange(e.target.value);  // Update react-hook-form state
                                      handleMehanikChange(e);  // Call your custom function
                                    }}
                                />
                                <div className="label-r">
                                    <Image
                                        src="/assets/images/mechanic.png"
                                        width="60"
                                        height="60"
                                        className="icon-avatar"
                                        alt="Mehanik 1"
                                    />
                                    <p className="text">Niko Kogovšek</p>
                                </div>
                            </label>

                            <label className="label">
                                <input
                                    {...field}  
                                    type="radio"
                                    value="3"
                                    checked={field.value === "3"}  
                                    required
                                    onChange={(e) => {
                                      field.onChange(e.target.value);  // Update react-hook-form state
                                      handleMehanikChange(e);  // Call your custom function
                                    }} 
                                />
                                <div className="label-r">
                                    <Image
                                        src="/assets/images/mechanic.png"
                                        width="60"
                                        height="60"
                                        className="icon-avatar"
                                        alt="Mehanik 1"
                                    />
                                    <p className="text">Niko Kogovšek</p>
                                </div>
                            </label>
                        </fieldset>
                        <FormMessage />
                    </FormItem>
                    
                )}
            />

            {/* Datum rezervacije */}
            <FormField
              control={form.control}
              name="datumRezervacije"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Izberi termin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />


            {/* ura rezervacije */}
            <FormField
                control={form.control}
                name="ura"
                render={({ field }) => (
                    <FormItem className="">
                        <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="button-group flex-wrap"
                              id="RadioGroup"
                            >
                                {workingHours.map((hour: number) => (
                                  <FormItem key={hour}>
                                    <FormControl>
                                      <RadioGroupItem value={String(hour)} className="hidden" />
                                    </FormControl>
                                    <FormLabel className="label">
                                      {`${hour}:00`}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

        <FormField
          control={form.control}
          name="storitve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Izberi storitev</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Izberi storitev" />
                    </SelectTrigger>
                </FormControl>
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
              
              <FormMessage />
            </FormItem>
          )}
        />
            
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="submit">Naroči se</Button>
                </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <Toaster/>
    </Dialog>
  )
}
