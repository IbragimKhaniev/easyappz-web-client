
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  image: string;
  className?: string;
}

export const ProjectCard = ({ title, image, className }: ProjectCardProps) => {
  return (
    <div className={cn("group relative overflow-hidden rounded-xl", className)}>
      <div className="aspect-[3/2] overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-medium text-white transform translate-y-8 transition-transform duration-300 group-hover:translate-y-0">
          {title}
        </h3>
      </div>
    </div>
  );
};
