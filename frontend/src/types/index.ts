export type AppMode = 'empresa' | 'normal';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'comum' | 'solo' | 'equipe';
  default_mode: AppMode;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id?: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  mode: AppMode;
  action_type?: string | null;
  action_payload?: any;
  created_at: string;
}

export interface ExecutedTask {
  id: string;
  user_id: string;
  task_type: string;
  title: string;
  status: 'completed' | 'preview' | 'failed' | 'pending';
  file_name?: string | null;
  file_url?: string | null;
  details_json?: any;
  created_at: string;
}

export interface DocxParams {
  title: string;
  content: string;
  filename?: string;
  author?: string;
  mode?: AppMode;
}

export interface XlsxParams {
  filename?: string;
  sheet_name?: string;
  title?: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface PdfParams {
  title: string;
  subtitle?: string;
  content: string;
  filename?: string;
  author?: string;
  sections?: { heading: string; text: string }[];
}

export interface EmailParams {
  recipient: string;
  subject: string;
  body: string;
  sender_name?: string;
  confirm?: boolean;
}

export interface CalcParams {
  calc_type?: 'financial' | 'operational';
  inputs: {
    revenue?: number;
    costs?: number;
    operating_expenses?: number;
    tax_rate?: number;
    initial_investment?: number;
    expected_gain?: number;
    [key: string]: any;
  };
  generate_report?: boolean;
}

export interface FileOrganizeParams {
  target_directory: string;
  rule?: 'by_extension' | 'by_date' | 'by_type';
  confirm?: boolean;
}

