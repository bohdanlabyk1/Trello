import { useState, useEffect } from 'react';
import { useProjectStore } from './../boards/apiboardc';
import { useDebounce } from './util';

const HeaderSearch = () => {
  const {
    setSearchQuery,
    searchType,
    setSearchType,
  } = useProjectStore();

  const [value, setValue] = useState('');
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    setSearchQuery(debounced);
  }, [debounced, setSearchQuery]);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid #ccc',
        }}
      />

      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        style={{
          padding: '6px',
          borderRadius: 6,
        }}
      >
        <option value="task">Task</option>
        <option value="user">User</option>
        <option value="sprint">Sprint</option>
      </select>
    </div>
  );
};

export default HeaderSearch;
