import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SortFilter = ({ items, sortOrder, onSortChange, sortFunctions, sortOptions, children }) => {
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);

  useEffect(() => {
    setCurrentSortOrder(sortOrder);
  }, [sortOrder]);

  const handleSortChange = (event) => {
    const newSortOrder = event.target.value;
    setCurrentSortOrder(newSortOrder);
    onSortChange(newSortOrder);
  };

  // Sort items based on the current sort order
  const sortedItems = sortFunctions[currentSortOrder] ? [...items].sort(sortFunctions[currentSortOrder]) : items;

  return (
    <div>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="sort-label">Sort by</InputLabel>
        <Select
          labelId="sort-label"
          id="sort"
          value={currentSortOrder}
          onChange={handleSortChange}
          label="Sort by"
          sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {children(sortedItems)}
    </div>
  );
};

export default SortFilter;
