import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Marquee, dly } from "@/components/ui/Decor";
import BookingClient from "@/components/site/BookingClient";
import { BOOKING, SERVICES, istDateOf } from "@/lib/bookingConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Choose a service, pick a time, and get an instant confirmation with a calendar invite.",
};

export default function BookPage() {
  const today = istDateOf(new Date());
  const openWeekdays = Object.entries(BOOKING.hours)
    .filter(([, v]) => v)
    .map(([k]) => Number(k));

  return (
    <>
      <PageHeader
        eyebrow="BOOK A SESSION"
        title="Book an Appointment"
        description="Choose a service, pick a time, and receive an instant confirmation with a calendar invite."
      />

      {/* <Marquee words={SERVICES.map((s) => s.name.split(" ")[0])} /> */}

      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-16 lg:py-24">
        <div aria-hidden className="v-drift pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute right-[10%] top-24 -z-10 h-3 w-3 rounded-full bg-gold/70 blur-[1px]" />
        <div aria-hidden className="v-float pointer-events-none absolute left-[6%] top-[60%] -z-10 h-2 w-2 rounded-full bg-violet/60" style={dly(2)} />

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <BookingClient
            services={SERVICES.map((s) => ({ ...s }))}
            today={today}
            maxDaysAhead={BOOKING.maxDaysAhead}
            openWeekdays={openWeekdays}
            studioAddress={BOOKING.studioAddress}
          />
        </div>
      </section>
    </>
  );
}
