"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function FaqsAdminPage() {
  return (
    <EntityManager
      apiBase="/api/admin/faqs"
      title="FAQs"
      listColumns={[
        { key: "question", label: "Question" },
        { key: "context", label: "Context" },
      ]}
      fields={[
        { name: "question", label: "Question", type: "text" },
        { name: "answer", label: "Answer", type: "textarea" },
        { name: "context", label: "Context", type: "select", options: [{ value: "general", label: "General" }, { value: "booking", label: "Booking page" }] },
        { name: "related_service_id", label: "Related Service ID (optional)", type: "number" },
        { name: "related_course_id", label: "Related Course ID (optional)", type: "number" },
        { name: "sort_order", label: "Sort Order", type: "number" },
      ]}
    />
  );
}
