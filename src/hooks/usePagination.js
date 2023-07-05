import { useState } from 'react';

export const usePagination = (defaultPage = 1, defaultPerPage = 10) => {
  const [page, setPage] = useState(defaultPage);
  const [perPage, setPerPage] = useState(defaultPerPage);

  return { page, perPage, setPage, setPerPage };
};
