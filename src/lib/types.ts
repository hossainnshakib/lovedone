export interface Photo {
  id: string;
  storage_path: string;
  image_url: string;
  context_note: string | null;
  caption: string | null;
  photo_date: string | null;
  order_index: number;
  created_at: string;
}

export interface Settings {
  id: number;
  recipient_label: string;
  intro_message: string;
  closing_message: string;
  updated_at: string;
}
