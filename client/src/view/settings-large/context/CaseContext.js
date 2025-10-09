import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCases, createCaseApi, updateCaseApi, deleteCaseApi } from '../../../api/cases';

const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchCases();
        if (mounted) setCases(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load cases:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const createCase = async (newCase) => {
    const created = await createCaseApi(newCase);
    setCases(prev => [created, ...prev]);
    return created;
  };

  const updateCase = async (updatedCase) => {
    const { caseId, ...payload } = updatedCase;
    const saved = await updateCaseApi(caseId, payload);
    setCases(prev => prev.map(c => c.caseId === caseId ? saved : c));
    return saved;
  };

  const deleteCase = async (caseId) => {
    await deleteCaseApi(caseId);
    setCases(prev => prev.filter(c => c.caseId !== caseId));
  };

  return (
    <CaseContext.Provider value={{ 
      cases, 
      loading, 
      createCase, 
      updateCase, 
      deleteCase 
    }}>
      {children}
    </CaseContext.Provider>
  );
};

// 自定义Hook简化Context使用
export const useCaseContext = () => {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCaseContext must be used within a CaseProvider');
  }
  return context;
};
