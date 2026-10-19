import * as React from "react";
import {
  // Navigation & actions
  Home, Users, User, UserRound, UsersRound, Phone, Mail, MapPin, Clock,
  Menu, X, Check, CircleCheck, CircleHelp, ChevronRight, ArrowRight, ArrowUpRight,
  Send, Search, Filter, Download, Upload, Trash2, Pencil, Plus, LogOut,
  // Content & school
  GraduationCap, School, BookOpen, FileText, ClipboardList, ClipboardCheck,
  CalendarDays, Heart, Target, Eye, Lightbulb, Info, Image as ImageIcon,
  Award, Medal, Trophy, BriefcaseBusiness, Building2, MessageCircle, Bell,
  // Admin & data
  LayoutDashboard, Wallet, ReceiptText, ShieldCheck, Settings, CreditCard,
  ChartNoAxesColumnIncreasing, ChartNoAxesCombined, Sparkles, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Icon name registry
 *
 * Deliberately an explicit allow-list: <ModernIcon name={...} /> can never
 * resolve an arbitrary component (no dynamic import by string), so a value
 * arriving from data, a URL, or the database can at worst fall back to a
 * placeholder — never render something unexpected.
 * ------------------------------------------------------------------ */
export const MODERN_ICONS = {
  // navigation & actions
  home: Home,
  users: Users,
  user: User,
  userRound: UserRound,
  usersRound: UsersRound,
  phone: Phone,
  mail: Mail,
  mapPin: MapPin,
  clock: Clock,
  menu: Menu,
  close: X,
  check: Check,
  circleCheck: CircleCheck,
  chevronRight: ChevronRight,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  send: Send,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  trash: Trash2,
  pencil: Pencil,
  plus: Plus,
  logout: LogOut,
  // content & school
  graduation: GraduationCap,
  school: School,
  book: BookOpen,
  fileText: FileText,
  clipboardList: ClipboardList,
  clipboardCheck: ClipboardCheck,
  calendar: CalendarDays,
  heart: Heart,
  target: Target,
  eye: Eye,
  lightbulb: Lightbulb,
  info: Info,
  image: ImageIcon,
  award: Award,
  medal: Medal,
  trophy: Trophy,
  briefcase: BriefcaseBusiness,
  building: Building2,
  message: MessageCircle,
  bell: Bell,
  // admin & data
  dashboard: LayoutDashboard,
  wallet: Wallet,
  receipt: ReceiptText,
  shield: ShieldCheck,
  settings: Settings,
  creditCard: CreditCard,
  chartUp: ChartNoAxesColumnIncreasing,
  chartMixed: ChartNoAxesCombined,
  sparkles: Sparkles,
  star: Star,
} as const;

export type ModernIconName = keyof typeof MODERN_ICONS;
export type ModernIconColor =
  | "blue" | "purple" | "green" | "orange" | "pink"
  | "red" | "cyan" | "yellow" | "slate";
export type ModernIconVariant = "soft" | "gradient" | "solid" | "outline";
export type ModernIconSize = "sm" | "md" | "lg" | "xl";
export type ModernIconShape = "rounded-square" | "circle" | "rounded";

/* Container + glyph dimensions per size preset.
 * Static maps (not interpolated strings) so Tailwind's JIT sees the full
 * class names at build time. Container is aspect-square so icons never
 * stretch; the glyph is centred by the container's flex alignment. */
const SIZE: Record<ModernIconSize, { box: string; icon: number }> = {
  sm: { box: "h-9 w-9", icon: 18 },   // 36px / 18px
  md: { box: "h-12 w-12", icon: 22 }, // 48px / 22px
  lg: { box: "h-14 w-14", icon: 26 }, // 56px / 26px
  xl: { box: "h-[72px] w-[72px]", icon: 32 }, // 72px / 32px
};

const SHAPE: Record<ModernIconShape, string> = {
  "rounded-square": "rounded-2xl",
  circle: "rounded-full",
  rounded: "rounded-xl",
};

const VARIANT: Record<ModernIconVariant, Record<ModernIconColor, string>> = {
  // Pastel wash + matching strong icon — the default look.
  soft: {
    blue: "bg-tint-blue text-ink-blue",
    purple: "bg-tint-purple text-ink-purple",
    green: "bg-tint-green text-ink-green",
    orange: "bg-tint-orange text-ink-orange",
    pink: "bg-tint-pink text-ink-pink",
    red: "bg-tint-red text-ink-red",
    cyan: "bg-tint-cyan text-ink-cyan",
    yellow: "bg-tint-yellow text-ink-yellow",
    slate: "bg-tint-slate text-ink-slate",
  },
  // Two-stop gradient wash, saturated glyph. Restrained, not neon.
  gradient: {
    blue: "bg-gradient-to-br from-tint-blue to-[#BFDBFE] text-ink-blue",
    purple: "bg-gradient-to-br from-tint-purple to-[#DDD6FE] text-ink-purple",
    green: "bg-gradient-to-br from-tint-green to-[#BBF7D0] text-ink-green",
    orange: "bg-gradient-to-br from-tint-orange to-[#FED7AA] text-ink-orange",
    pink: "bg-gradient-to-br from-tint-pink to-[#FBCFE8] text-ink-pink",
    red: "bg-gradient-to-br from-tint-red to-[#FECACA] text-ink-red",
    cyan: "bg-gradient-to-br from-tint-cyan to-[#A5F3FC] text-ink-cyan",
    yellow: "bg-gradient-to-br from-tint-yellow to-[#FEF08A] text-ink-yellow",
    slate: "bg-gradient-to-br from-tint-slate to-[#E2E8F0] text-ink-slate",
  },
  // Solid accent fill, white glyph — for prominent/selected states.
  solid: {
    blue: "bg-ink-blue text-white",
    purple: "bg-ink-purple text-white",
    green: "bg-ink-green text-white",
    orange: "bg-ink-orange text-white",
    pink: "bg-ink-pink text-white",
    red: "bg-ink-red text-white",
    cyan: "bg-ink-cyan text-white",
    yellow: "bg-ink-yellow text-white",
    slate: "bg-ink-slate text-white",
  },
  // Thin coloured border, transparent fill — compact / secondary.
  outline: {
    blue: "border border-ink-blue/30 text-ink-blue",
    purple: "border border-ink-purple/30 text-ink-purple",
    green: "border border-ink-green/30 text-ink-green",
    orange: "border border-ink-orange/30 text-ink-orange",
    pink: "border border-ink-pink/30 text-ink-pink",
    red: "border border-ink-red/30 text-ink-red",
    cyan: "border border-ink-cyan/30 text-ink-cyan",
    yellow: "border border-ink-yellow/30 text-ink-yellow",
    slate: "border border-ink-slate/30 text-ink-slate",
  },
};

export interface ModernIconProps {
  name: ModernIconName;
  color?: ModernIconColor;
  variant?: ModernIconVariant;
  size?: ModernIconSize;
  shape?: ModernIconShape;
  /** Override the glyph size (px). Container stays per `size`. */
  iconSize?: number;
  /** Renders a subtle hover lift + tint. Use only on interactive containers. */
  interactive?: boolean;
  className?: string;
  /** Provide for standalone meaning; omit for purely decorative icons. */
  ariaLabel?: string;
  /** Stroke weight for the glyph. Defaults to 2. */
  strokeWidth?: number;
}

/**
 * The single icon primitive for the whole site.
 *
 *   <ModernIcon name="graduation" color="blue" size="lg" />
 *   <ModernIcon name="phone" color="green" variant="solid" ariaLabel="Call us" />
 */
export function ModernIcon({
  name,
  color = "blue",
  variant = "soft",
  size = "md",
  shape = "rounded-square",
  iconSize,
  interactive = false,
  className,
  ariaLabel,
  strokeWidth = 2,
}: ModernIconProps) {
  const Glyph = MODERN_ICONS[name] ?? CircleHelp;
  const dims = SIZE[size];
  const decorative = !ariaLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center flex-shrink-0 aspect-square",
        dims.box,
        SHAPE[shape],
        VARIANT[variant][color],
        // Motion is opt-in and opt-out: honours the OS "reduce motion" setting.
        interactive &&
          "transition duration-200 ease-out hover:brightness-95 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none cursor-pointer",
        className
      )}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": ariaLabel })}
    >
      <Glyph size={iconSize ?? dims.icon} strokeWidth={strokeWidth} aria-hidden="true" />
    </span>
  );
}
