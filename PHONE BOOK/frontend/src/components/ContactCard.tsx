import { useState } from "react";
import { Contact } from "@/types/contact";
import { getRandomPastelClass } from "@/lib/pastelColors";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Heart, Star, Sparkles } from "lucide-react";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function ContactCard({ contact, onEdit, onDelete, index }: ContactCardProps) {
  const pastelClass = getRandomPastelClass(contact._id);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const decorativeIcons = [Star, Heart, Sparkles];
  const DecorativeIcon = decorativeIcons[index % decorativeIcons.length];
  
  return (
    <div
      className={`${pastelClass} rounded-3xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:scale-[1.015] hover:-translate-y-1 animate-bounce-in group relative w-[230px]`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating icon */}
      <div className={`absolute top-2 right-2 z-10 transition-all duration-500 
        ${isHovered ? "opacity-100 scale-100 rotate-12" : "opacity-0 scale-50 rotate-0"}`}>
        <DecorativeIcon className="w-5 h-5 text-primary/70 drop-shadow-md" />
      </div>

      {/* Like button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110`}
      >
        <Heart 
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isLiked ? "fill-destructive text-destructive scale-110" : "text-muted-foreground"
          }`} 
        />
      </button>

      {/* Image Section - smaller */}
      <div className="relative w-full h-[140px] overflow-hidden">
        <img
          src={contact.image || `https://picsum.photos/seed/${encodeURIComponent(contact.name)}/200`}
          alt={contact.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          loading="lazy"
        />
      </div>

      {/* Info Section - compact */}
      <div className="p-3 space-y-2">
        
        <h3 className="font-semibold text-base truncate">
          {contact.name}
        </h3>

        <p className="text-muted-foreground text-xs flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          {contact.phone}
        </p>

        <div className="flex gap-2 pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(contact)}
            className="flex-1 text-xs py-1"
          >
            <Pencil className="w-3 h-3" />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(contact._id)}
            className="flex-1 text-xs py-1"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
