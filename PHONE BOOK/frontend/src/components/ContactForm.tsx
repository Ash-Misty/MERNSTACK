import { useState, useEffect } from "react";
import { Contact, ContactFormData } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X, Loader2, User, Phone, Sparkles, Star } from "lucide-react";

interface ContactFormProps {
  editingContact: Contact | null;
  onSave: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function ContactForm({ editingContact, onSave, onCancel, isLoading }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    phone: "",
  });
  const [isFocused, setIsFocused] = useState<string | null>(null);

  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name,
        phone: editingContact.phone,
      });
    } else {
      setFormData({ name: "", phone: "" });
    }
  }, [editingContact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    await onSave(formData);
  };

  const previewImage = formData.name.trim()
    ? `https://picsum.photos/seed/${encodeURIComponent(formData.name.trim())}/200`
    : null;

  return (
    <div className="animate-slide-down">
      <div className="bg-card rounded-2xl shadow-soft p-8 max-w-md mx-auto relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-pastel-lavender/50 blur-2xl animate-float" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-pastel-pink/50 blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Floating sparkles */}
        <Sparkles className="absolute top-4 right-4 w-5 h-5 text-primary/30 animate-bounce-subtle" />
        <Star className="absolute bottom-4 left-4 w-4 h-4 text-primary/20 animate-swing" />
        
        <div className="text-center mb-6 relative">
          {/* Image preview with enhanced animation */}
          <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transition-all duration-500 ${previewImage ? 'ring-4 ring-primary/30 ring-offset-2 ring-offset-card' : 'bg-primary/10'}`}>
            {previewImage ? (
              <>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover animate-flip-in"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
              </>
            ) : (
              <User className="w-10 h-10 text-primary animate-bounce-subtle" />
            )}
            
            {/* Decorative ring animation */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground animate-slide-up">
            {editingContact ? "Edit Contact" : "New Contact"} 
            <Sparkles className="inline-block w-5 h-5 text-primary ml-2 animate-wiggle" />
          </h2>
          <p className="text-muted-foreground text-sm mt-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {editingContact
              ? "Update the contact details below"
              : "Fill in the details to add a new friend"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {/* Name field with enhanced styling */}
          <div className={`space-y-2 transition-all duration-300 ${isFocused === 'name' ? 'transform scale-[1.02]' : ''}`}>
            <Label htmlFor="name" className="text-foreground font-medium flex items-center gap-2">
              <User className={`w-4 h-4 transition-colors duration-300 ${isFocused === 'name' ? 'text-primary animate-bounce-subtle' : 'text-primary/70'}`} />
              Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="Enter name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setIsFocused('name')}
                onBlur={() => setIsFocused(null)}
                className={`h-12 rounded-xl border-2 transition-all duration-300 ${isFocused === 'name' ? 'border-primary shadow-lg shadow-primary/20' : 'focus:border-primary'}`}
                required
                disabled={isLoading}
              />
              {formData.name && (
                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 animate-pop" />
              )}
            </div>
          </div>

          {/* Phone field with enhanced styling */}
          <div className={`space-y-2 transition-all duration-300 ${isFocused === 'phone' ? 'transform scale-[1.02]' : ''}`}>
            <Label htmlFor="phone" className="text-foreground font-medium flex items-center gap-2">
              <Phone className={`w-4 h-4 transition-colors duration-300 ${isFocused === 'phone' ? 'text-primary animate-bounce-subtle' : 'text-primary/70'}`} />
              Phone Number
            </Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onFocus={() => setIsFocused('phone')}
                onBlur={() => setIsFocused(null)}
                className={`h-12 rounded-xl border-2 transition-all duration-300 ${isFocused === 'phone' ? 'border-primary shadow-lg shadow-primary/20' : 'focus:border-primary'}`}
                required
                disabled={isLoading}
              />
              {formData.phone && (
                <Star className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 animate-pop" />
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 btn-bounce hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="playful"
              disabled={isLoading || !formData.name.trim() || !formData.phone.trim()}
              className="flex-1 btn-bounce relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                  Save
                  {/* Confetti effect hint */}
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
