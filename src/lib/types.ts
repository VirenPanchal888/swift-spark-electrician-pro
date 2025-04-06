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
