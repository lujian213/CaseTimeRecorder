import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchRecords, createRecordApi, updateRecordApi, deleteRecordApi, fetchRecordsByCaseId } from '../../../api/records';

const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchRecords();
        if (mounted) setRecords(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load records:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const reloadByCase = async (caseId) => {
    const data = await fetchRecordsByCaseId(caseId);
    setRecords(Array.isArray(data) ? data : []);
  };

  const createRecord = async (newRecord) => {
    const created = await createRecordApi(newRecord);
    setRecords(prev => [created, ...prev]);
    return created;
  };

  const updateRecord = async (updatedRecord) => {
    const { recordId, ...payload } = updatedRecord;
    const saved = await updateRecordApi(recordId, payload);
    setRecords(prev => prev.map(r => r.recordId === recordId ? saved : r));
    return saved;
  };

  const deleteRecord = async (recordId) => {
    await deleteRecordApi(recordId);
    setRecords(prev => prev.filter(r => r.recordId !== recordId));
  };

  const getRecordsByCaseId = (caseId) => {
    return records.filter(r => r.caseId === caseId);
  };

  return (
    <RecordContext.Provider value={{ 
      records, 
      loading, 
      createRecord, 
      updateRecord, 
      deleteRecord,
      getRecordsByCaseId,
      reloadByCase,
    }}>
      {children}
    </RecordContext.Provider>
  );
};

// 自定义Hook简化Context使用
export const useRecordContext = () => {
  const context = useContext(RecordContext);
  if (context === undefined) {
    throw new Error('useRecordContext must be used within a RecordProvider');
  }
  return context;
};
