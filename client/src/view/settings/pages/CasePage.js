import React, { useState } from 'react';
import { useCaseContext } from '../context/CaseContext';
import CaseList from '../components/case/CaseList';
import CaseForm from '../components/case/CaseForm';
import CaseDetail from '../components/case/CaseItem';

const CasePage = ({ formOpen, currentItem, onCloseForm, onEdit }) => {
  const { cases, loading, error, createCase, updateCase, deleteCase } = useCaseContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // 处理表单提交
  const handleFormSubmit = (data) => {
    if (data.caseId) {
      // 编辑现有案例
      updateCase(data);
    } else {
      // 创建新案例
      createCase(data);
    }
    onCloseForm();
  };

  // 处理删除案例
  const handleDelete = (caseId) => {
    deleteCase(caseId);
  };

  // 查看案例详情
  const handleView = (caseItem) => {
    setSelectedCase(caseItem);
    setDetailOpen(true);
  };

  // 关闭详情对话框
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedCase(null);
  };

  return (
    <div>
      <CaseList
        cases={cases}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onDelete={handleDelete}
        onView={handleView}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* 案例表单对话框 */}
      <CaseForm
        open={formOpen}
        initialData={currentItem}
        onClose={onCloseForm}
        onSubmit={handleFormSubmit}
      />
      
      {/* 案例详情对话框 */}
      <CaseDetail
        open={detailOpen}
        caseData={selectedCase}
        onClose={handleCloseDetail}
        onEdit={onEdit}
      />
    </div>
  );
};

export default CasePage;
