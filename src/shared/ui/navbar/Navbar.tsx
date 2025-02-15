
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "О нас", path: ROUTES.ABOUT },
  { title: "Маркетплайс", path: ROUTES.MARKETPLACE },
];

export const Navbar = () => {
  return (
    <nav className="fixed top-0 right-0 z-50 mt-[60px] mr-[150px]">
      <ul className="flex gap-12">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={cn(
                "text-lg font-medium text-muted-foreground transition-colors hover:text-primary",
                "relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0",
                "after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
