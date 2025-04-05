import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Employee, MaterialUsage, Material } from './types';

interface StoreState {
  transactions: Transaction[];
  employees: Employee[];
  materials: Material[];
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  // Employee actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  
  // Material actions
  addMaterial: (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMaterial: (material: Material) => void;
  deleteMaterial: (id: string) => void;
  
  // Calculation helpers
  calculateTotalCost: () => number;
  calculateMaterialUsage: () => MaterialUsage[];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      transactions: [],
      employees: [],
      materials: [],
      
      // Transaction actions
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },
      
      updateTransaction: (updatedTransaction) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) => 
            transaction.id === updatedTransaction.id ? updatedTransaction : transaction
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        }));
      },
      
      // Employee actions
      addEmployee: (employee) => {
        const newEmployee = {
          ...employee,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          employees: [...state.employees, newEmployee],
        }));
      },
      
      updateEmployee: (updatedEmployee) => {
        set((state) => ({
          employees: state.employees.map((employee) => 
            employee.id === updatedEmployee.id ? updatedEmployee : employee
          ),
        }));
      },
      
      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((employee) => employee.id !== id),
        }));
      },
      
      // Material actions
      addMaterial: (material) => {
        const now = new Date().toISOString();
        const newMaterial = {
          ...material,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          materials: [...state.materials, newMaterial],
        }));
      },
      
      updateMaterial: (updatedMaterial) => {
        set((state) => ({
          materials: state.materials.map((material) => 
            material.id === updatedMaterial.id 
              ? { ...updatedMaterial, updatedAt: new Date().toISOString() } 
              : material
          ),
        }));
      },
      
      deleteMaterial: (id) => {
        set((state) => ({
          materials: state.materials.filter((material) => material.id !== id),
        }));
      },
      
      // Calculation helpers
      calculateTotalCost: () => {
        const { transactions } = get();
        return transactions.reduce((total, transaction) => total + transaction.amount, 0);
      },
      
      calculateMaterialUsage: () => {
        const { transactions } = get();
        const materialMap = new Map<string, { totalQuantity: number; totalCost: number }>();
        
        transactions.forEach((transaction) => {
          const { materialName, quantity, amount } = transaction;
          const existingMaterial = materialMap.get(materialName);
          
          if (existingMaterial) {
            materialMap.set(materialName, {
              totalQuantity: existingMaterial.totalQuantity + quantity,
              totalCost: existingMaterial.totalCost + amount,
            });
          } else {
            materialMap.set(materialName, {
              totalQuantity: quantity,
              totalCost: amount,
            });
          }
        });
        
        const materialUsage: MaterialUsage[] = [];
        
        materialMap.forEach((value, key) => {
          materialUsage.push({
            materialName: key,
            totalQuantity: value.totalQuantity,
            totalCost: value.totalCost,
            averageCost: value.totalCost / value.totalQuantity,
          });
        });
        
        return materialUsage;
      },
    }),
    {
      name: 'electrician-app-storage',
    }
  )
);
