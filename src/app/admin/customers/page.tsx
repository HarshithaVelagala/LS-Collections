import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { serialize } from "@/lib/serialize";
import CustomersManager from "@/components/admin/CustomersManager";

export const metadata = {
  title: "Client Directory | LS Collections Admin",
  description: "View customer profiles, registration timestamps, and saved locations.",
};

export default async function AdminCustomersPage() {
  let customers: any[] = [];

  try {
    await connectDB();
    const rawUsers = await User.find({}).sort({ createdAt: -1 }).lean();
    
    customers = rawUsers.map((doc: any) => ({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      role: doc.role,
      addressesCount: doc.addresses?.length || 0,
      createdAt: doc.createdAt?.toISOString(),
    }));

    // Inject mock customer data if database user collection is empty
    if (customers.length === 0) {
      customers = [
        {
          id: "mock-c-1",
          name: "Sunita Roy",
          email: "sunita.roy@gmail.com",
          role: "user",
          addressesCount: 2,
          createdAt: new Date().toISOString(),
        },
        {
          id: "mock-c-2",
          name: "Aman Gupta",
          email: "aman@boatearphone.com",
          role: "user",
          addressesCount: 1,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "mock-c-3",
          name: "Devyani Sharma",
          email: "devyani@outlook.com",
          role: "user",
          addressesCount: 3,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        }
      ];
    }
  } catch (error) {
    console.error("Customers Admin Fetch Error:", error);
  }

  return <CustomersManager customers={serialize(customers)} />;
}
