
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
