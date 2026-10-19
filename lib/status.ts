/**
 * Status colours for admin pipelines.
 *
 * Every class string is written out in full rather than composed at runtime,
 * because Tailwind's JIT only emits classes it can see literally in the
 * source. Add a status here and both the pill and the select pick it up.
 */

export type EnquiryStatus = "NEW" | "CONTACTED" | "FOLLOW_UP" | "CONVERTED" | "CLOSED";

/** Ordered the way the office works them: newest first, won/lost at the end. */
export const ENQUIRY_STATUSES: readonly { value: EnquiryStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "FOLLOW_UP", label: "Follow-up" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
];

interface StatusStyle {
  /** Compact label chip. */
  pill: string;
  /** The <select> itself, tinted to match. */
  select: string;
}

const ENQUIRY_STATUS_STYLES: Record<EnquiryStatus, StatusStyle> = {
  NEW: {
    pill: "bg-blue-100 text-blue-800 border-blue-200",
    select: "bg-blue-50 border-blue-300 text-blue-900",
  },
  CONTACTED: {
    pill: "bg-yellow-100 text-yellow-800 border-yellow-200",
    select: "bg-yellow-50 border-yellow-300 text-yellow-900",
  },
  FOLLOW_UP: {
    pill: "bg-orange-100 text-orange-800 border-orange-200",
    select: "bg-orange-50 border-orange-300 text-orange-900",
  },
  CONVERTED: {
    pill: "bg-green-100 text-green-800 border-green-200",
    select: "bg-green-50 border-green-300 text-green-900",
  },
  CLOSED: {
    pill: "bg-red-100 text-red-800 border-red-200",
    select: "bg-red-50 border-red-300 text-red-900",
  },
};

/** Neutral fallback, so an unrecognised status never renders as a wrong colour. */
const NEUTRAL: StatusStyle = {
  pill: "bg-slate-100 text-slate-700 border-slate-200",
  select: "bg-white border-slate-300 text-slate-900",
};

export function enquiryStatusStyles(status: string): StatusStyle {
  return ENQUIRY_STATUS_STYLES[status as EnquiryStatus] ?? NEUTRAL;
}

export function enquiryStatusLabel(status: string): string {
  return ENQUIRY_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export const ENQUIRY_STATUS_VALUES: readonly string[] = ENQUIRY_STATUSES.map((s) => s.value);

/* ------------------------------------------------------------------ *
 * Contact-message statuses
 *
 * A separate set from the enquiry pipeline above — a message moves
 * New → Read → Replied → Closed, which is not the same journey as an
 * application, so it gets its own list rather than reusing those labels.
 * Colours follow the same palette so the two admin screens read alike.
 * ------------------------------------------------------------------ */

export type MessageStatus = "NEW" | "READ" | "REPLIED" | "CLOSED";

export const MESSAGE_STATUSES: readonly { value: MessageStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "CLOSED", label: "Closed" },
];

const MESSAGE_STATUS_STYLES: Record<MessageStatus, StatusStyle> = {
  // Unread: same blue as a new enquiry — waiting for someone to pick it up.
  NEW: {
    pill: "bg-blue-100 text-blue-800 border-blue-200",
    select: "bg-blue-50 border-blue-300 text-blue-900",
  },
  // Seen but not yet answered.
  READ: {
    pill: "bg-yellow-100 text-yellow-800 border-yellow-200",
    select: "bg-yellow-50 border-yellow-300 text-yellow-900",
  },
  // Answered — the successful end state, so green like "Converted".
  REPLIED: {
    pill: "bg-green-100 text-green-800 border-green-200",
    select: "bg-green-50 border-green-300 text-green-900",
  },
  CLOSED: {
    pill: "bg-red-100 text-red-800 border-red-200",
    select: "bg-red-50 border-red-300 text-red-900",
  },
};

export function messageStatusStyles(status: string): StatusStyle {
  return MESSAGE_STATUS_STYLES[status as MessageStatus] ?? NEUTRAL;
}

export function messageStatusLabel(status: string): string {
  return MESSAGE_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export const MESSAGE_STATUS_VALUES: readonly string[] = MESSAGE_STATUSES.map((s) => s.value);

/* ------------------------------------------------------------------ *
 * List ordering
 *
 * The admin lists are worked top-down: anything still needing attention sits at
 * the top and finished items sink to the bottom. The rank comes from the status
 * arrays above, which are already declared in work order — so reordering a list
 * there reorders the screen too, instead of the order being maintained twice.
 * ------------------------------------------------------------------ */

/** A row as far as ordering is concerned — both admin tables satisfy this. */
type OrderedRow = { status: string; createdAt: string | Date };

const ENQUIRY_RANK = new Map<string, number>(
  ENQUIRY_STATUSES.map((s, i): [string, number] => [s.value, i])
);
const MESSAGE_RANK = new Map<string, number>(
  MESSAGE_STATUSES.map((s, i): [string, number] => [s.value, i])
);

function byStatusThenNewest(rank: Map<string, number>) {
  return (a: OrderedRow, b: OrderedRow): number => {
    // An unrecognised status ranks last rather than first, so a bad value can
    // never push an untouched row above the ones that need work.
    const ra = rank.get(a.status) ?? rank.size;
    const rb = rank.get(b.status) ?? rank.size;
    if (ra !== rb) return ra - rb;
    // Within one status, newest first — the order the API already returns.
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };
}

/** Applications: New first, Closed last. */
export const compareEnquiries = byStatusThenNewest(ENQUIRY_RANK);
/** Messages: New first, Closed last. */
export const compareMessages = byStatusThenNewest(MESSAGE_RANK);
