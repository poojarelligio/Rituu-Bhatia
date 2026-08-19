"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function EventsAdminPage() {
  return (
    <EntityManager
      apiBase="/api/admin/events"
      title="Workshops & Events"
      listColumns={[
        { key: "title", label: "Title" },
        { key: "event_date", label: "Date" },
        { key: "event_status", label: "Upcoming/Past" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text" },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "description", label: "Full Description", type: "textarea" },
        { name: "event_date", label: "Date", type: "date" },
        { name: "event_time", label: "Time", type: "text", help: 'e.g. "10:00 AM - 4:00 PM"' },
        { name: "location", label: "Location", type: "text" },
        { name: "speaker", label: "Speaker/Trainer", type: "text" },
        { name: "fee_display", label: "Fee (display)", type: "text" },
        { name: "fee_amount", label: "Fee (paise)", type: "number" },
        { name: "event_status", label: "Upcoming or Past", type: "select", options: [{ value: "upcoming", label: "Upcoming" }, { value: "past", label: "Past" }] },
        { name: "registration_link", label: "External Registration Link (optional)", type: "text" },
        { name: "image_url", label: "Image", type: "image" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
      ]}
    />
  );
}
