import PolicyLayout from "@/components/shared/PolicyLayout";

export default function TermsConditionsPage() {
  return (
    <PolicyLayout 
      title="Terms & Conditions" 
      lastUpdated="October 15, 2023"
      breadcrumbs={[
        { label: "Policies", href: "#" },
        { label: "Terms & Conditions", href: "/terms-conditions" }
      ]}
    >
      <h2>Agreement to Terms</h2>
      <p>
        These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and LS Collections ("Company", “we”, “us”, or “our”), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
      </p>

      <h2>Intellectual Property Rights</h2>
      <p>
        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us.
      </p>

      <h2>User Representations</h2>
      <p>By using the Site, you represent and warrant that:</p>
      <ul>
        <li>All registration information you submit will be true, accurate, current, and complete.</li>
        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
        <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
        <li>You are not a minor in the jurisdiction in which you reside.</li>
      </ul>

      <h2>Products</h2>
      <p>
        We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
      </p>
    </PolicyLayout>
  );
}
