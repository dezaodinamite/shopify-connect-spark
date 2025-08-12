import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top on route change
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always reset scroll when navigating to a different page
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
