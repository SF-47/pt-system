import {
  LayoutDashboard, Users, Dumbbell, Utensils, CreditCard, Plus, Pencil,
  ArrowRight, CheckCircle, Clock, XCircle, LogOut, Eye, CalendarDays,
} from "lucide-react";

// Keep the existing icon prop contract; Lucide now supplies every drawing.
const icons = {
  dashboard: LayoutDashboard,
  clients: Users,
  workout: Dumbbell,
  meal: Utensils,
  payment: CreditCard,
  plus: Plus,
  edit: Pencil,
  arrow: ArrowRight,
  check: CheckCircle,
  clock: Clock,
  close: XCircle,
  logout: LogOut,
  view: Eye,
  calendar: CalendarDays,
};

export type IconName = keyof typeof icons;

export default function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const LucideIcon = icons[name];
  return (
    <LucideIcon
      className={`inline-block size-5 shrink-0 align-middle ${className}`}
      strokeWidth={1.7}
      aria-hidden="true"
      focusable="false"
    />
  );
}
