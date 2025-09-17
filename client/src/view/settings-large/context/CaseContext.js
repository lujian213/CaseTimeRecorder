import React, { createContext, useContext, useState, useEffect } from 'react';

const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始化模拟数据
  useEffect(() => {
    // 模拟API请求延迟
    setTimeout(() => {
      setCases([
        { caseId: 1, caseName: "系统故障排查", description: "修复登录功能异常", status: "ACTIVE" },
        { caseId: 2, caseName: "性能优化", description: "提升首页加载速度", status: "ACTIVE" },
        { caseId: 3, caseName: "安全审计", description: "检查系统安全漏洞", status: "INACTIVE" }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  // 获取新ID
  const getNextId = () => {
    return cases.length > 0 ? Math.max(...cases.map(c => c.caseId)) + 1 : 1;
  };

  // 创建案例
  const createCase = (newCase) => {
    const caseWithId = { ...newCase, caseId: getNextId() };
    setCases(prev => [...prev, caseWithId]);
    return caseWithId;
  };

  // 更新案例
  const updateCase = (updatedCase) => {
    setCases(prev => prev.map(c => 
      c.caseId === updatedCase.caseId ? updatedCase : c
    ));
  };

  // 删除案例
  const deleteCase = (caseId) => {
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
