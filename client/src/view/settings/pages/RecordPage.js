import React, { useState } from 'react';
import { useRecordContext } from '../context/RecordContext';
import { useCaseContext } from '../context/CaseContext';
import { useUserContext } from '../context/UserContext';
import RecordList from '../components/record/RecordList';
import RecordForm from '../components/record/RecordForm';

const RecordPage = ({ formOpen, currentItem, onCloseForm, onEdit }) => {
  const { records, loading, error, createRecord, updateRecord, deleteRecord } = useRecordContext();
  const { cases } = useCaseContext();
  const { users } = useUserContext();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  // 处理表单提交
  const handleFormSubmit = (data) => {
    if (data.recordId) {
      // 编辑现有记录
      updateRecord(data);
    } else {
      // 创建新记录
      createRecord(data);
    }
    onCloseForm();
  };

  // 处理删除记录
  const handleDelete = (caseId, recordId) => {
    deleteRecord(caseId, recordId);
  };

  return (
    <div>
      <RecordList
        records={records}
        cases={cases}
        users={users}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onDelete={handleDelete}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCaseId={selectedCaseId}
        setSelectedCaseId={setSelectedCaseId}
      />
      
      {/* 记录表单对话框 */}
      <RecordForm
        open={formOpen}
        initialData={currentItem}
        cases={cases}
        users={users}
        onClose={onCloseForm}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default RecordPage;
