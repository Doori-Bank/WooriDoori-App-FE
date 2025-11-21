import React, { createContext, useContext, useState } from 'react';

interface AdminHeaderActions {
  onCreate?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

interface AdminHeaderContextType {
  actions: AdminHeaderActions;
  setActions: (actions: AdminHeaderActions) => void;
}

const AdminHeaderContext = createContext<AdminHeaderContextType | undefined>(undefined);

export const AdminHeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<AdminHeaderActions>({});

  return (
    <AdminHeaderContext.Provider value={{ actions, setActions }}>
      {children}
    </AdminHeaderContext.Provider>
  );
};

export const useAdminHeader = () => {
  const context = useContext(AdminHeaderContext);
  if (context === undefined) {
    throw new Error('useAdminHeader must be used within an AdminHeaderProvider');
  }
  return context;
};

