import { Contact } from "@/types/contact";
import { ContactCard } from "./ContactCard";
import { Users, Sparkles, Star, Heart, Smile } from "lucide-react";

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function ContactList({ contacts, onEdit, onDelete, isLoading }: ContactListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        {/* Animated loading indicator */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-primary animate-bounce-subtle" />
          </div>

          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pastel-pink" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pastel-blue" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-pastel-lavender" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-pastel-mint" />
          </div>
        </div>

        <p className="text-muted-foreground animate-pulse">Loading your friends...</p>

        <div className="flex gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-pastel-lavender flex items-center justify-center mb-6 animate-float glow relative">
            <Users className="w-14 h-14 text-primary" />
            <Smile className="absolute -bottom-1 -right-1 w-8 h-8 text-primary/70 animate-bounce-subtle" />
          </div>

          <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-wiggle" />
          <Star className="w-5 h-5 text-primary/60 absolute -bottom-4 -left-2 animate-swing" />
          <Heart className="w-4 h-4 text-destructive/50 absolute top-4 -left-4 animate-float" style={{ animationDelay: '0.5s' }} />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          No contacts yet! <span className="inline-block ml-2 animate-wave">👋</span>
        </h3>

        <p className="text-muted-foreground text-center max-w-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Your contact list is empty. Click the <strong className="text-primary">"Add Contact"</strong> button to add your first friend!
        </p>

        <div className="mt-6 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">☝️</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 animate-slide-up">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">{contacts.length}</span>
          <span className="text-muted-foreground">contact{contacts.length !== 1 ? "s" : ""}</span>
        </div>

        {contacts.length >= 5 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary animate-wiggle" />
            <span>You're popular!</span>
          </div>
        )}
      </div>

      {/* Contact grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {contacts.map((contact, index) => (
          <ContactCard
            key={contact._id}                     // ✔ FIXED
            contact={contact}
            onEdit={onEdit}
            onDelete={() => onDelete(contact._id)} // ✔ FIXED
            index={index}
          />
        ))}
      </div>

      {contacts.length > 0 && (
        <div
          className="mt-8 text-center animate-fade-in"
          style={{ animationDelay: `${contacts.length * 100 + 200}ms` }}
        >
          <p className="text-muted-foreground/60 text-sm flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-destructive/50 animate-heartbeat" />
            Made By ASH
            <Heart className="w-4 h-4 text-destructive/50 animate-heartbeat" style={{ animationDelay: "0.2s" }} />
          </p>
        </div>
      )}
    </div>
  );
}
