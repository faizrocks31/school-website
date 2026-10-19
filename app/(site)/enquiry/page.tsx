import { redirect } from "next/navigation";

// The admission form used to live at /enquiry. Keep old links and bookmarks working.
export default function EnquiryRedirect() {
  redirect("/apply");
}
