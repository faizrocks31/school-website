import { redirect } from "next/navigation";

// The admin list was renamed Enquiries → Applications. Keep old links working.
export default function AdminEnquiriesRedirect() {
  redirect("/admin/applications");
}
