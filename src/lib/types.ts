
export interface Transaction {
  id: string;
  materialName: string;
  amount: number;
  quantity: number;
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  siteLocation: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface MaterialUsage {
  materialName: string;
  totalQuantity: number;
  totalCost: number;
  averageCost: number;
}

export interface CalculationResult {
  totalCost: number;
  materialsUsed: MaterialUsage[];
}

export interface Material {
  id: string;
  materialName: string;
  quantity: number;
  unit?: string;
  site: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
}

export type SiteStatus = 'active' | 'paused' | 'completed';

export interface Site {
  id: string;
  name: string;
  location: string;
  startDate: string;
  status: SiteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SiteEmployee {
  id: string;
  siteId: string;
  employeeId: string;
  role: string;
  shift: string;
  contact?: string;
  startDate: string;
  endDate?: string;
}

export interface SiteMaterial {
  id: string;
  siteId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  deliveryDate: string;
  supplier?: string;
  notes?: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface SiteTask {
  id: string;
  siteId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: string;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
}

export interface SiteDocument {
  id: string;
  siteId: string;
  documentId: string;
  uploadDate: string;
  type: string;
}
