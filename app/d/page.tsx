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
  
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { datumRezervacije, delovneUreMehanika, zasedenDanMehanika, zasedeneUreDatuma } from "@/lib/actions"
import { useState } from "react"; 

import { narediRezervacijo } from "@/lib/actions"; // 

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
        required_error: "Izberi uro.",
    }),
    storitve: z.string({
        required_error: "Izberi storitev.",
    })
})



export default function DatePickerDialog() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workingHours, setWorkingHours] = useState<number[]>([])
  const [mehanikId, setMehanikId] = useState<string>('')
  const [zasedeneUre, setZasedeneUre] = useState<string[]>([])
  const [datum, setDatum] = useState<string>("")
  const [selectedUra, setSelectedUra] = useState(""); 
  const [zasedenDan, setZasedenDan] = useState(false);


  const fetchWorkingHours = async (id: string, date: string) => {
    const datummRezervacije = await datumRezervacije(id)
    const zasedeeUre = await zasedeneUreDatuma(date, datummRezervacije)
    const delovneUre = await delovneUreMehanika(id)

    console.log("fetching ure")
    console.log(selectedUra)

    setSelectedUra("");
    const zasedenDan = await zasedenDanMehanika(delovneUre,zasedeeUre);
    if(zasedenDan){
      setWorkingHours([])
      setZasedenDan(true)
      
      setSelectedUra("");
      console.log("zaseden dan")
    console.log(selectedUra)
    } else{
      setWorkingHours([])
      setWorkingHours(delovneUre)
    }

    setZasedeneUre(zasedeeUre)
  }

  const handledatumChange = async (date: Date | null) => {
    setSelectedUra("");
    setZasedenDan(false)
    setWorkingHours([])

    form.unregister('ura');
    // Set manual error
      

    console.log("datum")
    console.log(selectedUra)

    if (date) {
      setSelectedUra("");
      const formattedDate = date.toISOString().split('T')[0]
      setDatum(formattedDate)
      if (mehanikId) {
        form.unregister('ura');
    // Set manual error
      
        await fetchWorkingHours(mehanikId, formattedDate)
      }
    }
  }

  const handleMehanikChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value
    setSelectedUra("");
    setWorkingHours([])
    setZasedenDan(false)

    setMehanikId(id)
    console.log("mehanik")
    console.log(selectedUra)
    if (datum) {
      form.unregister('ura');
    // Set manual error
      form.setError('ura', {
        type: 'manual',
        message: 'Izberi drug datum, ker za ta dan ni več prostih terminov'
      });
      setSelectedUra("");
      await fetchWorkingHours(id, datum)
    }
  }
   
   

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("datumRezervacije", data.datumRezervacije.toISOString().split('T')[0]); 
      formData.append("mehaniki", data.mehaniki);
      formData.append("ura", data.ura);
      formData.append("storitve", data.storitve);
      formData.append("ime", data.ime);
      formData.append("priimek", data.priimek);
      
      await narediRezervacijo(formData);

      form.reset();
      setWorkingHours([])
      setDatum("")
      setZasedenDan(false)

      setIsDialogOpen(false);

      toast({
        title: "Rezervacija je bila uspešno oddana",
        description: (
          <>
            <p>Pozdravljeni {data.ime} {data.priimek}.</p>
            <p>Naročeni ste dne <span className="font-medium text-green-600">{data.datumRezervacije.toLocaleDateString("sl-SI")} ob {data.ura}:00</span>,</p>
            <p>na <span className="font-medium text-green-600">{data.storitve.replace(/_/g, " ")}</span></p>
          </>
        ),
        className: "toaster"
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Napaka pri oddaji rezervacije",
        variant: "destructive",
        description: "Prišlo je do napake, prosimo poskusite znova.",
      });
    }
  }
  
  

  return (
    <>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    
      <DialogTrigger asChild>
        <Button variant="outline">Naroči se</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] overflow-y-auto max-h-[85vh] sm:max-w-[525px] md:max-w-[625px]">
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
                            <Input {...field} value={field.value ?? ""}  placeholder="Ime" required/>
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
                            <Input {...field} value={field.value ?? ""}  placeholder="Priimek" required />
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
                        <Input {...field} value={field.value ?? ""}  placeholder="Email" required/>
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
                        <fieldset className="radio-input flex-wrap">
                            <label className="label h-[50px] w-full md:w-[180px] md:h-[100px]">
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
                                        src="/assets/images/mechanic1.png"
                                        width="60"
                                        height="60"
                                        className="icon-avatar hidden md:block"
                                        alt="Mehanik 1"
                                    />
                                    <p className="text-black text-sm font-light">Niko Kogovšek</p>
                                </div>
                            </label>

                            <label className="label h-[50px] w-full md:w-[180px] md:h-[100px]">
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
                                        src="/assets/images/mechanic2.png"
                                        width="60"
                                        height="60"
                                        className="icon-avatar hidden md:block"
                                        alt="Mehanik 1"
                                    />
                                    <p className="text-black text-sm font-light">Anton kovač</p>
                                </div>
                            </label>

                            <label className="label h-[50px] w-full md:w-[180px] md:h-[100px]">
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
                                        src="/assets/images/mechanic3.png"
                                        width="60"
                                        height="60"
                                        className="icon-avatar hidden md:block"
                                        alt="Mehanik 1"
                                    />
                                    <p className="text-black text-sm font-light">Miha Kovačev</p>
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
                            "w-full sm:w-[50%] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Izberi datum</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        required
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            // Posodobi stanje v react-hook-form samo, če je datum veljaven
                            field.onChange(date);
                        
                            // Pokliči svojo prilagojeno funkcijo
                            handledatumChange(date);
                          } 
                        }}
                        disabled={(date) => date < new Date()}
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
                  <FormItem className="min-h-16 md:min-h-24 relative">
                      {zasedenDan ? (
                          // zasedenDan true
                          <div className="size-full bg-red-50 z-[100] text-black/70 rounded-md absolute opacity-100 top-0 left-0 text-xs flex items-center justify-center font-light">
                              Za ta dan ni več možnih terminov
                          </div>
                      ) : (
                          // false
                          <div className={`${workingHours.length === 0 ? "size-full bg-gray-200/20 text-black/70 rounded-md absolute top-0 left-0 text-xs flex items-center justify-center font-light" : "hidden"}`}>
                              Izberite mehanika in datum za prikaz ur.
                          </div>
                      )}

                      {/* Add an additional container with relative positioning for proper stacking */}
                      <div className="relative z-[101] size-full ">
                          <FormControl>
                              <RadioGroup
                                  onValueChange={(value) => {
                                      setSelectedUra(value); // Posodobi state ob spremembi
                                      field.onChange(value); // Obvesti obrazec (če uporabljaš react-hook-form)
                                  }}
                                  required
                                  value={selectedUra}
                                  className="button-group flex-wrap"
                                  id="urice"
                              >
                                            {workingHours.map((hour) => (
                                                <FormItem key={hour}>
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={String(hour)}
                                                            disabled={zasedeneUre.includes(String(hour))}
                                                            className="hidden"
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormLabel className={zasedeneUre.includes(String(hour)) ? "zasedeno label" : "label"}>{hour}:00</FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage className={`${zasedenDan ? "min-h-16 md:min-h-24 size-full h-full flex items-end translate-y-5 justify-start" : "min-h-16 md:min-h-24 size-full h-full flex items-end translate-y-5 justify-start"}`} />
                                </div>
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
                    <SelectTrigger className="w-full sm:w-[50%] ">
                        <SelectValue placeholder="storitev" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                        {/* Quick Service (Hitri servis) */}
                        {/* Quick Service (Hitri servis) */}
                        <SelectGroup>
                          <SelectLabel>Hitri servis</SelectLabel>
                          <SelectItem value="menjava_olja" data-label="Menjava olja">Menjava olja</SelectItem>
                          <SelectItem value="menjava_filtrov" data-label="Menjava filtrov">Menjava filtrov</SelectItem>
                          <SelectItem value="dopolnitev_tekočin" data-label="Dopolnitev tekočin">Dopolnitev tekočin</SelectItem>
                          <SelectItem value="preverjanje_akumulatorja" data-label="Preverjanje akumulatorja">Preverjanje akumulatorja</SelectItem>
                        </SelectGroup>

                        {/* Tire Services (Vulkanizerstvo) */}
                        <SelectGroup>
                          <SelectLabel>Vulkanizerstvo</SelectLabel>
                          <SelectItem value="montaža_pnevmatik" data-label="Montaža pnevmatik">Montaža pnevmatik</SelectItem>
                          <SelectItem value="uravnoteženje_pnevmatik" data-label="Uravnoteženje pnevmatik">Uravnoteženje pnevmatik</SelectItem>
                          <SelectItem value="popravilo_pnevmatik" data-label="Popravilo pnevmatik">Popravilo pnevmatik</SelectItem>
                          <SelectItem value="geometrija_koles" data-label="Geometrija koles">Geometrija koles</SelectItem>
                        </SelectGroup>

                        {/* Repairs (Popravila) */}
                        <SelectGroup>
                          <SelectLabel>Popravila</SelectLabel>
                          <SelectItem value="popravilo_zavor" data-label="Popravilo zavor">Popravilo zavor</SelectItem>
                          <SelectItem value="popravilo_motorja" data-label="Popravilo motorja">Popravilo motorja</SelectItem>
                          <SelectItem value="popravilo_vzmetenja" data-label="Popravilo vzmetenja">Popravilo vzmetenja</SelectItem>
                          <SelectItem value="popravilo_izpušnega_sistema" data-label="Popravilo izpušnega sistema">Popravilo izpušnega sistema</SelectItem>
                        </SelectGroup>

                        {/* Diagnostics (Diagnostika) */}
                        <SelectGroup>
                          <SelectLabel>Diagnostika</SelectLabel>
                          <SelectItem value="električna_diagnostika" data-label="Električna diagnostika">Električna diagnostika</SelectItem>
                          <SelectItem value="diagnostika_motorja" data-label="Diagnostika motorja">Diagnostika motorja</SelectItem>
                          <SelectItem value="diagnostika_klimatske_naprave" data-label="Diagnostika klimatske naprave">Diagnostika klimatske naprave</SelectItem>
                        </SelectGroup>


                      </SelectContent>
              </Select>
              
              <FormMessage />
            </FormItem>
          )}
        />
            
            <DialogFooter>
              <Button type="submit">Naroči se</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    <Toaster/>
    </>
  )
}
