import CategoriesManager from "@/components/admin/CategoriesManager";

export const metadata = {
  title: "Category Taxonomy | LS Collections Admin",
  description: "Configure product catalog categorizations and subcategories.",
};

export default function AdminCategoriesPage() {
  return <CategoriesManager />;
}
