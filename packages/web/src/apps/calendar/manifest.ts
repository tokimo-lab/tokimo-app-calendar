import { CalendarDays } from "lucide-react";
import type { AppManifest } from "../_framework/types";

export const manifest: AppManifest = {
  id: "calendar",
  name: "Calendar",
  category: "system",
  fullBleed: true,
  defaultSize: { width: 900, height: 680 },
  icon: CalendarDays,
  image: "/page-icons/calendar.png",
  color: "#ef4444",
  labelKey: "calendar",
  order: 36,
  component: () => import("./pages"),
};
