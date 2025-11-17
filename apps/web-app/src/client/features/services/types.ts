/**
 * Service feature types for frontend
 */

export interface ServiceCategoryData {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceData {
  id: string;
  businessId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  active: boolean;
}
