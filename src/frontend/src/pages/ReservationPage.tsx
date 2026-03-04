import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateReservation } from "@/hooks/useQueries";
import {
  Calendar,
  CalendarCheck,
  Clock,
  Loader2,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const TIME_SLOTS = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const GUEST_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);

type FormState = {
  customerName: string;
  phone: string;
  date: string;
  time: string;
  numberOfGuests: string;
};

const initialForm: FormState = {
  customerName: "",
  phone: "",
  date: "",
  time: "",
  numberOfGuests: "",
};

export default function ReservationPage() {
  const createReservation = useCreateReservation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const todayStr = new Date().toISOString().split("T")[0];

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};

    if (!form.customerName.trim()) newErrors.customerName = "Name is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone))
      newErrors.phone = "Please enter a valid phone number.";
    if (!form.date) newErrors.date = "Please select a date.";
    else if (form.date < todayStr)
      newErrors.date = "Please select a future date.";
    if (!form.time) newErrors.time = "Please select a time slot.";
    if (!form.numberOfGuests)
      newErrors.numberOfGuests = "Please select the number of guests.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createReservation.mutateAsync({
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        date: form.date,
        time: form.time,
        numberOfGuests: BigInt(Number.parseInt(form.numberOfGuests, 10)),
      });

      toast.success(
        `Reservation confirmed for ${form.customerName} on ${form.date} at ${form.time}!`,
      );
      setForm(initialForm);
      setErrors({});
    } catch {
      toast.error("Failed to create reservation. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-10 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
          >
            Secure Your Evening
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3"
          >
            Reservations
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="ornamental-divider max-w-xs mx-auto"
          >
            <span className="font-accent text-sm italic text-muted-foreground">
              We look forward to welcoming you
            </span>
          </motion.div>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-border/60 shadow-warm">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="font-body text-sm flex items-center gap-1.5"
                    >
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jean Dupont"
                      value={form.customerName}
                      onChange={(e) => setField("customerName", e.target.value)}
                      className={`font-body text-sm ${errors.customerName ? "border-destructive" : ""}`}
                      autoComplete="name"
                    />
                    {errors.customerName && (
                      <p className="font-body text-xs text-destructive">
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="font-body text-sm flex items-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+33 1 23 45 67 89"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      className={`font-body text-sm ${errors.phone ? "border-destructive" : ""}`}
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p className="font-body text-xs text-destructive">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="date"
                      className="font-body text-sm flex items-center gap-1.5"
                    >
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      min={todayStr}
                      value={form.date}
                      onChange={(e) => setField("date", e.target.value)}
                      className={`font-body text-sm ${errors.date ? "border-destructive" : ""}`}
                    />
                    {errors.date && (
                      <p className="font-body text-xs text-destructive">
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="time"
                      className="font-body text-sm flex items-center gap-1.5"
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      Time <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.time}
                      onValueChange={(v) => setField("time", v)}
                    >
                      <SelectTrigger
                        id="time"
                        className={`font-body text-sm ${errors.time ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem
                            key={slot}
                            value={slot}
                            className="font-body text-sm"
                          >
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time && (
                      <p className="font-body text-xs text-destructive">
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="guests"
                    className="font-body text-sm flex items-center gap-1.5"
                  >
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    Number of Guests <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.numberOfGuests}
                    onValueChange={(v) => setField("numberOfGuests", v)}
                  >
                    <SelectTrigger
                      id="guests"
                      className={`font-body text-sm max-w-xs ${
                        errors.numberOfGuests ? "border-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="How many guests?" />
                    </SelectTrigger>
                    <SelectContent>
                      {GUEST_OPTIONS.map((n) => (
                        <SelectItem
                          key={n}
                          value={String(n)}
                          className="font-body text-sm"
                        >
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.numberOfGuests && (
                    <p className="font-body text-xs text-destructive">
                      {errors.numberOfGuests}
                    </p>
                  )}
                </div>

                {/* Info note */}
                <div className="rounded-lg bg-accent/10 border border-accent/20 px-4 py-3">
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Note:</strong>{" "}
                    Reservations are held for 15 minutes past the booked time.
                    For parties of 8 or more, please contact us directly at{" "}
                    <span className="text-primary">+33 1 42 60 81 50</span>.
                  </p>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full font-body font-semibold bg-primary hover:bg-primary/90 h-11"
                  disabled={createReservation.isPending}
                >
                  {createReservation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming Reservation...
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      Confirm Reservation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info cards below form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-3 mt-8"
        >
          {[
            { label: "Opening Hours", value: "12pm – 11pm" },
            { label: "Phone", value: "+33 1 42 60 81 50" },
            { label: "Address", value: "12 Rue de la Paix" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-card border border-border/60 rounded-xl p-4 text-center shadow-xs"
            >
              <div className="font-body text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                {label}
              </div>
              <div className="font-display text-sm font-semibold text-foreground">
                {value}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 pt-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          © {new Date().getFullYear()} La Maison. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </main>
  );
}
