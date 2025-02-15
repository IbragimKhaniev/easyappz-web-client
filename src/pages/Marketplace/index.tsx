
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";
import { ProjectCard } from "./ui/ProjectCard";

const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    id: 2,
    title: "Portfolio Website",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    id: 3,
    title: "Blog Platform",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    id: 4,
    title: "Dashboard Template",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  },
];

export const MarketplacePage = () => {
  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center mb-12">
        <Link
          to={ROUTES.HOME}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold ml-4">Marketplace</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            image={project.image}
          />
        ))}
      </div>
    </div>
  );
};
