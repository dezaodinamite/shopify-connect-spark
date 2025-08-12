import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

function titleize(segment: string) {
  const map: Record<string, string> = {
    product: "Produto",
    cart: "Carrinho",
    faq: "FAQ",
    contato: "Contato",
  };
  return map[segment] || decodeURIComponent(segment).replace(/-/g, " ");
}

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const paths = segments.map((seg, idx) => ({
    name: titleize(seg),
    href: "/" + segments.slice(0, idx + 1).join("/"),
  }));

  if (segments.length === 0) return null;

  return (
    <Breadcrumb aria-label="breadcrumb" className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((p, i) => (
          <span key={p.href} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {i === paths.length - 1 ? (
                <BreadcrumbPage>{p.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={p.href}>{p.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
