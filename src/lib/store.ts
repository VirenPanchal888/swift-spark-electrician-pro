
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Employee, MaterialUsage, Material, Document, Site, SiteEmployee, SiteMaterial, SiteTask, SiteDocument, TaskStatus } from './types';

interface StoreState {
  transactions: Transaction[];
  employees: Employee[];
  materials: Material[];
  documents: Document[];
  sites: Site[];
  siteEmployees: SiteEmployee[];
  siteMaterials: SiteMaterial[];
  siteTasks: SiteTask[];
  siteDocuments: SiteDocument[];
  
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
  
  // Document actions
  addDocument: (document: Omit<Document, 'id' | 'uploadDate'>) => void;
  updateDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  
  // Site actions
  addSite: (site: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>) => Site;
  updateSite: (site: Site) => void;
  deleteSite: (id: string) => void;
  
  // Site Employee actions
  addSiteEmployee: (siteEmployee: Omit<SiteEmployee, 'id'>) => void;
  updateSiteEmployee: (siteEmployee: SiteEmployee) => void;
  deleteSiteEmployee: (id: string) => void;
  
  // Site Material actions
  addSiteMaterial: (siteMaterial: Omit<SiteMaterial, 'id'>) => void;
  updateSiteMaterial: (siteMaterial: SiteMaterial) => void;
  deleteSiteMaterial: (id: string) => void;
  
  // Site Task actions
  addSiteTask: (siteTask: Omit<SiteTask, 'id'>) => void;
  updateSiteTask: (siteTask: SiteTask) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteSiteTask: (id: string) => void;
  
  // Site Document actions
  addSiteDocument: (siteDocument: Omit<SiteDocument, 'id'>) => void;
  updateSiteDocument: (siteDocument: SiteDocument) => void;
  deleteSiteDocument: (id: string) => void;
  
  // Calculation helpers
  calculateTotalCost: () => number;
  calculateMaterialUsage: () => MaterialUsage[];
  
  // Site helpers
  getSiteById: (id: string) => Site | undefined;
  getSiteEmployees: (siteId: string) => SiteEmployee[];
  getSiteMaterials: (siteId: string) => SiteMaterial[];
  getSiteTasks: (siteId: string) => SiteTask[];
  getSiteDocuments: (siteId: string) => SiteDocument[];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      transactions: [],
      employees: [],
      materials: [],
      documents: [],
      sites: [],
      siteEmployees: [],
      siteMaterials: [],
      siteTasks: [],
      siteDocuments: [],
      
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
      
      // Document actions
      addDocument: (document) => {
        const now = new Date().toISOString();
        const newDocument = {
          ...document,
          id: crypto.randomUUID(),
          uploadDate: now,
        };
        set((state) => ({
          documents: [...state.documents, newDocument],
        }));
      },
      
      updateDocument: (updatedDocument) => {
        set((state) => ({
          documents: state.documents.map((document) => 
            document.id === updatedDocument.id ? updatedDocument : document
          ),
        }));
      },
      
      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((document) => document.id !== id),
        }));
      },
      
      // Site actions
      addSite: (site) => {
        const now = new Date().toISOString();
        const newSite = {
          ...site,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          sites: [...state.sites, newSite],
        }));
        
        return newSite; // Return the newly created site
      },
      
      updateSite: (updatedSite) => {
        set((state) => ({
          sites: state.sites.map((site) => 
            site.id === updatedSite.id 
              ? { ...updatedSite, updatedAt: new Date().toISOString() } 
              : site
          ),
        }));
      },
      
      deleteSite: (id) => {
        set((state) => ({
          sites: state.sites.filter((site) => site.id !== id),
          siteEmployees: state.siteEmployees.filter((se) => se.siteId !== id),
          siteMaterials: state.siteMaterials.filter((sm) => sm.siteId !== id),
          siteTasks: state.siteTasks.filter((st) => st.siteId !== id),
          siteDocuments: state.siteDocuments.filter((sd) => sd.siteId !== id),
        }));
      },
      
      // Site Employee actions
      addSiteEmployee: (siteEmployee) => {
        const newSiteEmployee = {
          ...siteEmployee,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          siteEmployees: [...state.siteEmployees, newSiteEmployee],
        }));
      },
      
      updateSiteEmployee: (updatedSiteEmployee) => {
        set((state) => ({
          siteEmployees: state.siteEmployees.map((siteEmployee) => 
            siteEmployee.id === updatedSiteEmployee.id ? updatedSiteEmployee : siteEmployee
          ),
        }));
      },
      
      deleteSiteEmployee: (id) => {
        set((state) => ({
          siteEmployees: state.siteEmployees.filter((siteEmployee) => siteEmployee.id !== id),
        }));
      },
      
      // Site Material actions
      addSiteMaterial: (siteMaterial) => {
        const newSiteMaterial = {
          ...siteMaterial,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          siteMaterials: [...state.siteMaterials, newSiteMaterial],
        }));
      },
      
      updateSiteMaterial: (updatedSiteMaterial) => {
        set((state) => ({
          siteMaterials: state.siteMaterials.map((siteMaterial) => 
            siteMaterial.id === updatedSiteMaterial.id ? updatedSiteMaterial : siteMaterial
          ),
        }));
      },
      
      deleteSiteMaterial: (id) => {
        set((state) => ({
          siteMaterials: state.siteMaterials.filter((siteMaterial) => siteMaterial.id !== id),
        }));
      },
      
      // Site Task actions
      addSiteTask: (siteTask) => {
        const newSiteTask = {
          ...siteTask,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          siteTasks: [...state.siteTasks, newSiteTask],
        }));
      },
      
      updateSiteTask: (updatedSiteTask) => {
        set((state) => ({
          siteTasks: state.siteTasks.map((siteTask) => 
            siteTask.id === updatedSiteTask.id ? updatedSiteTask : siteTask
          ),
        }));
      },
      
      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          siteTasks: state.siteTasks.map((task) => 
            task.id === taskId 
              ? { 
                  ...task, 
                  status, 
                  completedDate: status === 'completed' ? new Date().toISOString() : undefined 
                } 
              : task
          ),
        }));
      },
      
      deleteSiteTask: (id) => {
        set((state) => ({
          siteTasks: state.siteTasks.filter((siteTask) => siteTask.id !== id),
        }));
      },
      
      // Site Document actions
      addSiteDocument: (siteDocument) => {
        const newSiteDocument = {
          ...siteDocument,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          siteDocuments: [...state.siteDocuments, newSiteDocument],
        }));
      },
      
      updateSiteDocument: (updatedSiteDocument) => {
        set((state) => ({
          siteDocuments: state.siteDocuments.map((siteDocument) => 
            siteDocument.id === updatedSiteDocument.id ? updatedSiteDocument : siteDocument
          ),
        }));
      },
      
      deleteSiteDocument: (id) => {
        set((state) => ({
          siteDocuments: state.siteDocuments.filter((siteDocument) => siteDocument.id !== id),
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
      
      // Site helpers
      getSiteById: (id) => {
        return get().sites.find((site) => site.id === id);
      },
      
      getSiteEmployees: (siteId) => {
        return get().siteEmployees.filter((se) => se.siteId === siteId);
      },
      
      getSiteMaterials: (siteId) => {
        return get().siteMaterials.filter((sm) => sm.siteId === siteId);
      },
      
      getSiteTasks: (siteId) => {
        return get().siteTasks.filter((st) => st.siteId === siteId);
      },
      
      getSiteDocuments: (siteId) => {
        return get().siteDocuments.filter((sd) => sd.siteId === siteId);
      },
    }),
    {
      name: 'electrician-app-storage',
    }
  )
);
