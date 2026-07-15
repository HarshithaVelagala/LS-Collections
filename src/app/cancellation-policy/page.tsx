import PolicyLayout from "@/components/shared/PolicyLayout";

export default function CancellationPolicyPage() {
  return (
    <PolicyLayout 
      title="Cancellation Policy" 
      lastUpdated="October 15, 2023"
      breadcrumbs={[
        { label: "Policies", href: "#" },
        { label: "Cancellation Policy", href: "/cancellation-policy" }
      ]}
    >
      <h2>Order Cancellations</h2>
      <p>
        You may cancel your order free of charge within 2 hours of placing it. After this time frame, your order will begin processing, and we may not be able to cancel it.
      </p>

      <h2>How to Cancel</h2>
      <p>
        To cancel an order, log into your account, go to "My Orders", and click the "Cancel Order" button next to the relevant order. If the button is not available, the 2-hour window has passed. 
        In such cases, please contact our customer support team immediately at support@lscollections.com.
      </p>

      <h2>Custom and Pre-Orders</h2>
      <p>
        Cancellations for custom-made or pre-order items are only accepted within 24 hours of placing the order. After 24 hours, production begins, and these orders cannot be cancelled.
      </p>

      <h2>Refund for Cancelled Orders</h2>
      <p>
        If your order is successfully cancelled before dispatch, a full refund will be initiated to your original payment method. The refund will typically reflect in your account within 5-7 business days, depending on your bank's processing time.
      </p>

      <h2>Cancellations by LS Collections</h2>
      <p>
        We reserve the right to cancel any order for reasons including, but not limited to, stock unavailability, pricing errors, or suspicion of fraudulent activity. If we cancel your order, we will notify you immediately and issue a full refund.
      </p>
    </PolicyLayout>
  );
}
