import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";

export function NotFound() {
  return (
    <Layout title="Page not found">
      <p className="text-gray-600 mb-4">
        We couldn't find the page you're looking for.
      </p>
      <Link to="/" className="text-blue-600 underline">
        Back to search
      </Link>
    </Layout>
  );
}
