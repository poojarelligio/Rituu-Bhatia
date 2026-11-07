"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FreeConsultModal from "@/components/site/FreeConsultModal";

export default function ServiceBookingButtons({
  serviceId, serviceSlug, serviceTitle, layout = "row",
}: { serviceId: number; serviceSlug: string; serviceTitle: string; layout?: "row" | "hero" | "center" }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={layout === "hero" ? "flex flex-wrap gap-4" : "flex flex-wrap justify-center gap-4"}>
        <Button href={`/appointment?service=${serviceSlug}`} variant={layout === "hero" ? "primary" : "onDark"}>
          Book an Appointment
        </Button>
        <Button
          variant="secondary"
          className={layout === "hero" ? "" : "border-ivory/40 text-ivory hover:border-ivory"}
          onClick={() => setShowModal(true)}
        >
          Free 15-min Intro Call
        </Button>
      </div>
      {showModal && (
        <FreeConsultModal serviceId={serviceId} serviceTitle={serviceTitle} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
