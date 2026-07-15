import PolicyLayout from "@/components/shared/PolicyLayout";

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout 
      title="Shipping Policy" 
      lastUpdated="October 15, 2023"
      breadcrumbs={[
        { label: "Policies", href: "#" },
        { label: "Shipping Policy", href: "/shipping-policy" }
      ]}
    >
      <h2>Domestic Shipping</h2>
      <p>
        We offer standard and express shipping options across all major cities in India. Orders are typically processed and dispatched within 1-2 business days.
      </p>
      <ul>
        <li><strong>Standard Shipping:</strong> 3-5 business days. Free on orders over ₹5,000.</li>
        <li><strong>Express Shipping:</strong> 1-2 business days. Flat rate of ₹250.</li>
      </ul>

      <h2>International Shipping</h2>
      <p>
        We ship worldwide to most countries. International shipping rates are calculated at checkout based on the weight and destination of your order.
      </p>
      <ul>
        <li>Delivery times vary from 7-14 business days depending on customs clearance.</li>
        <li>Customers are responsible for any customs duties or taxes applicable in their respective countries.</li>
      </ul>

      <h2>Order Tracking</h2>
      <p>
        Once your order has been dispatched, you will receive an email and SMS with a tracking number and a link to trace your package. You can also log into your account to check your order status.
      </p>

      <h2>Lost or Damaged Packages</h2>
      <p>
        All our shipments are insured. If you receive a damaged package or if your package is lost in transit, please contact our support team within 48 hours of the delivery date or expected delivery date.
      </p>
    </PolicyLayout>
  );
}
