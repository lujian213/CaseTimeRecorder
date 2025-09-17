import React, { createContext, useContext, useState, useEffect } from 'react';

const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始化模拟数据
  useEffect(() => {
    setTimeout(() => {
      setRecords([
        { 
          recordId: 1, 
          caseId: 1,
          title: "初步排查结果", 
          content: "发现登录接口响应超时", 
          createdAt: "2023-10-01T10:30:00" 
        },
        { 
          recordId: 2, 
          caseId: 1,
          title: "问题修复", 
          content: "优化数据库查询，解决超时问题", 
          createdAt: "2023-10-01T14:20:00" 
        },
        { 
          recordId: 3, 
          caseId: 2,
          title: "性能分析", 
          content: "首页加载时间超过3秒，需要优化", 
          createdAt: "2023-10-02T09:15:00" 
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 新增记录
  const addRecord = (newRecord) => {
    const recordWithId = {
      ...newRecord,
      recordId: records.length > 0 ? Math.max(...records.map(r => r.recordId)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    setRecords(prev => [...prev, recordWithId]);
    return recordWithId;
  };

  // 更新记录
  const updateRecord = (updatedRecord) => {
    setRecords(prev => prev.map(r => 
      r.recordId === updatedRecord.recordId ? updatedRecord : r
    ));
  };

  // 删除记录
  const deleteRecord = (recordId) => {
    setRecords(prev => prev.filter(r => r.recordId !== recordId));
  };

  // 根据案例ID获取记录
  const getRecordsByCaseId = (caseId) => {
    return records.filter(r => r.caseId === caseId);
  };

  return (
    <RecordContext.Provider value={{ 
      records, 
      loading, 
      addRecord, 
      updateRecord, 
      deleteRecord,
      getRecordsByCaseId
    }}>
      {children}
    </RecordContext.Provider>
  );
};

// 自定义Hook简化Context使用
export const useRecordContext = () => useContext(RecordContext);
    