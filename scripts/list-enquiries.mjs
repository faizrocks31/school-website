import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const rows = await prisma.admissionEnquiry.findMany({ orderBy: { createdAt: "desc" } });
if (rows.length === 0) console.log("No enquiries yet. Submit one at http://localhost:3001/enquiry");
else {
  console.table(rows.map(r => ({
    enquiryNumber: r.enquiryNumber,
    studentName: r.studentName,
    fatherName: r.fatherName,
    age: r.studentAge,
    class: r.admissionClass,
    contact: r.contactNumber,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  })));
  console.log(`\nTotal: ${rows.length}`);
}
await prisma.$disconnect();
