export type InputType = 
  | 'number' 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'boolean' 
  | 'rating' 
  | 'time' 
  | 'distance' 
  | 'percentage' 
  | 'url' 
  | 'file' 
  | 'note';

export type Visibility = 'internal' | 'parent_visible' | 'coach_only';

export interface EvaluationMetric {
  id: string;
  template_id: string;
  metric_key: string;
  label: string;
  description?: string | null;
  input_type: InputType;
  unit?: string | null;
  lower_is_better: boolean;
  required: boolean;
  sort_order: number;
  min_value?: number | null;
  max_value?: number | null;
  options?: any | null; // jsonb
  visibility: Visibility;
  category: string;
  is_active: boolean;
  created_at?: string;
}

export interface EvaluationTemplate {
  id: string;
  program_id?: string | null;
  location_id?: string | null;
  name: string;
  description?: string | null;
  type: string;
  is_active: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
  metrics?: EvaluationMetric[]; // For joined queries
}
