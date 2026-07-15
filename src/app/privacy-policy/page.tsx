import PolicyLayout from "@/components/shared/PolicyLayout";

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout 
      title="Privacy Policy" 
      lastUpdated="October 15, 2023"
      breadcrumbs={[
        { label: "Policies", href: "#" },
        { label: "Privacy Policy", href: "/privacy-policy" }
      ]}
    >
      <h2>Introduction</h2>
      <p>
        At LS Collections, we respect your privacy and are committed to protecting your personal data. 
        This privacy policy will inform you as to how we look after your personal data when you visit our website 
        and tell you about your privacy rights and how the law protects you.
      </p>

      <h2>Information We Collect</h2>
      <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
      <ul>
        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
        <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
        <li><strong>Financial Data:</strong> includes bank account and payment card details (processed securely by our payment gateways).</li>
        <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
      </ul>

      <h2>How We Use Your Data</h2>
      <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
      <ul>
        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
        <li>Where we need to comply with a legal obligation.</li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
      </p>
    </PolicyLayout>
  );
}
