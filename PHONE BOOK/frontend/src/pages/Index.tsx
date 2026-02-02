import { useState, useEffect, useCallback } from "react";
import { Contact, ContactFormData } from "@/types/contact";
import { contactApi } from "@/lib/api";
import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { ContactList } from "@/components/ContactList";
import { useToast } from "@/hooks/use-toast";
import { Star, Heart, Sparkles, Circle } from "lucide-react";

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch contacts function
  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contactApi.getAll();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load contacts on page load
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleToggleForm = () => {
    setShowForm(true);
    setEditingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  //  AUTO REFRESH AFTER UPDATE OR CREATE
  const handleSave = async (data: ContactFormData) => {
    try {
      setIsSaving(true);

      if (editingContact) {
        await contactApi.update(editingContact._id, data); 
        toast({
          title: "Success! ✨",
          description: `${data.name} has been updated.`,
        });
      } else {
        await contactApi.create(data);
        toast({
          title: "Success! 🎉",
          description: `${data.name} has been added to your contacts.`,
        });
      }

      await fetchContacts(); //  refresh list after save
      setShowForm(false);
      setEditingContact(null);
    } catch (error) {
      console.error("Failed to save contact:", error);
      toast({
        title: "Error",
        description: "Failed to save contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // AUTO REFRESH AFTER DELETE
  const handleDelete = async (id: string) => {
    try {
      await contactApi.delete(id);
      await fetchContacts(); //full refresh for accuracy

      toast({
        title: "Deleted 🗑️",
        description: "Contact has been removed.",
      });
    } catch (error) {
      console.error("Failed to delete contact:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Header showForm={showForm} onToggleForm={handleToggleForm} />

      <main className="container mx-auto px-4 pb-12 relative z-10">
        {showForm ? (
          <ContactForm
            editingContact={editingContact}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        ) : (
          <ContactList
            contacts={contacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Decorative elements (unchanged) */}
      <div className="fixed -z-10 top-20 left-10 w-72 h-72 bg-pastel-pink rounded-full blur-3xl opacity-30 animate-float" />
      <div className="fixed -z-10 bottom-20 right-10 w-96 h-96 bg-pastel-blue rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: "1s" }} />
      <div className="fixed -z-10 top-1/2 left-1/2 w-64 h-64 bg-pastel-lavender rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }} />
      <div className="fixed -z-10 top-40 right-20 w-48 h-48 bg-pastel-mint rounded-full blur-3xl opacity-25 animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="fixed -z-10 bottom-40 left-20 w-56 h-56 bg-pastel-peach rounded-full blur-3xl opacity-25 animate-float" style={{ animationDelay: "2.5s" }} />
      <Star className="fixed top-1/4 right-[10%] w-6 h-6 text-primary/20 animate-float -z-5" style={{ animationDelay: "0.5s" }} />
      <Heart className="fixed bottom-1/4 left-[15%] w-5 h-5 text-destructive/20 animate-float -z-5" style={{ animationDelay: "1.2s" }} />
      <Sparkles className="fixed top-1/3 left-[8%] w-4 h-4 text-primary/15 animate-wiggle -z-5" />
      <Circle className="fixed bottom-1/3 right-[12%] w-3 h-3 text-primary/10 animate-bounce-subtle -z-5" />
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue animate-gradient-shift bg-[length:200%_100%] opacity-50" />
    </div>
  );
};

export default Index;
