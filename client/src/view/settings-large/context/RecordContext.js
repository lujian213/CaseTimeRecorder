import React, { createContext, useContext, useState, useEffect } from 'react';

const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始化模拟数据
  useEffect(() => {
    // 模拟API请求延迟
    setTimeout(() => {
      setRecords([
        {
          recordId: 1,
          userId: "user1",
          caseId: 1,
          startTime: new Date('2023-07-01T09:00:00').getTime(),
          endTime: new Date('2023-07-01T11:30:00').getTime(),
          category: "调试",
          comments: "修复了登录失败的问题"
        },
        {
          recordId: 2,
          userId: "user2",
          caseId: 2,
          startTime: new Date('2023-07-02T14:00:00').getTime(),
          endTime: new Date('2023-07-02T16:45:00').getTime(),
          category: "优化",
          comments: "优化了首页加载速度"
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  // 获取新ID
  const getNextId = () => {
    return records.length > 0 ? Math.max(...records.map(r => r.recordId)) + 1 : 1;
  };

  // 创建记录
  const createRecord = (newRecord) => {
    const recordWithId = { ...newRecord, recordId: getNextId() };
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

  // 获取特定案例的所有记录
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
      getRecordsByCaseId
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
