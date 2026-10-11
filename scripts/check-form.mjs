// Submits a test enquiry to verify the API (hits the running dev server).
const payload = {
  studentName: "Aarav Sharma",
  fatherName: "Rajesh Sharma",
  studentAge: 6,
  contactNumber: "9876543210",
  address: "House 12, Gandhi Nagar, Knowledge City, State 110001",
  admissionClass: "Class 1",
  parentEmail: "test@example.com",
  consent: true,
};
const base = process.env.BASE_URL || "http://localhost:3001";
const res = await fetch(`${base}/api/v1/admission-enquiries`, {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const json = await res.json();
console.log("Status:", res.status);
console.log(JSON.stringify(json, null, 2));
if (res.status === 201) console.log("\n✓ Enquiry saved —", json.enquiryNumber);
else if (res.status === 409) console.log("\n✓ Duplicate guard working —", json.message);
else console.log("\n✗", json.message);
