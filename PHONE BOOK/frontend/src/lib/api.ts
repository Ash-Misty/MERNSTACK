import { Contact, ContactFormData } from "@/types/contact";

const API_BASE = "http://localhost:3000/api";


export const contactApi = {
  async getAll(): Promise<Contact[]> {
    const response = await fetch(`${API_BASE}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }
    return response.json();
  },

  async create(data: ContactFormData): Promise<Contact> {
    const contactWithImage = {
      ...data,
      image: `https://picsum.photos/seed/${encodeURIComponent(data.name)}/200`,
    };

    const response = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactWithImage),
    });

    if (!response.ok) {
      throw new Error("Failed to create contact");
    }
    return response.json();
  },

  async update(id: string, data: ContactFormData): Promise<Contact> {
    const contactWithImage = {
      ...data,
      image: `https://picsum.photos/seed/${encodeURIComponent(data.name)}/200`,
    };

    const response = await fetch(`${API_BASE}/update_contact/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactWithImage),
    });

    if (!response.ok) {
      throw new Error("Failed to update contact");
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/delete_contact/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }
  },
};
