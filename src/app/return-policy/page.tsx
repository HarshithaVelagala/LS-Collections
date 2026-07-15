import PolicyLayout from "@/components/shared/PolicyLayout";

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout 
      title="Return & Refund Policy" 
      lastUpdated="October 15, 2023"
      breadcrumbs={[
        { label: "Policies", href: "#" },
        { label: "Return Policy", href: "/return-policy" }
      ]}
    >
      <h2>7-Day Return Policy</h2>
      <p>
        We want you to love what you ordered. If you are not completely satisfied with your purchase, you may return it within 7 days of receiving the item for a full refund or exchange, subject to the conditions below.
      </p>

      <h2>Return Conditions</h2>
      <ul>
        <li>Items must be unused, unwashed, and in the same condition that you received them.</li>
        <li>Items must be in the original packaging with all tags attached.</li>
        <li>Custom-made or personalized items are exempt from being returned.</li>
        <li>Earrings and nose rings cannot be returned due to hygiene reasons unless they arrive damaged.</li>
      </ul>

      <h2>Return Process</h2>
      <p>
        To initiate a return, please log into your account, go to "My Orders", and select the "Return" option. Alternatively, contact our customer service team at support@lscollections.com with your order number. 
        Once your return request is approved, we will arrange a reverse pickup from your address.
      </p>

      <h2>Refunds</h2>
      <p>
        Once your return is received and inspected, we will notify you of the approval or rejection of your refund. 
        If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.
      </p>

      <h2>Exchanges</h2>
      <p>
        If you need to exchange an item for a different size or color, please follow the return process and place a new order for the desired item.
      </p>
    </PolicyLayout>
  );
}
