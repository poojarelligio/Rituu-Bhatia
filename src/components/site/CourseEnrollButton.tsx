"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CourseEnrollModal from "@/components/site/CourseEnrollModal";

interface CourseEnrollButtonProps {
  courseId: number;
  courseTitle: string;
  priceDisplay: string;
  variant?: "primary" | "onDark";
}

export default function CourseEnrollButton({
  courseId, courseTitle, priceDisplay, variant = "primary",
}: CourseEnrollButtonProps) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button variant={variant} onClick={() => setShow(true)}>Enquire Now</Button>
      {show && <CourseEnrollModal courseId={courseId} courseTitle={courseTitle} priceDisplay={priceDisplay} onClose={() => setShow(false)} />}
    </>
  );
}