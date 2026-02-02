export interface Contact {
  _id: string;
  name: string;
  phone: string;
  image?: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
}
