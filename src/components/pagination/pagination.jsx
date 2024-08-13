import Pagination from "react-bootstrap/Pagination";
import React, { useState } from "react";

function AdvancedPagination({
  totalItems,
  itemsPerPage,
  currentPage,
  paginate,
}) {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination>
      <Pagination.First onClick={() => paginate(1)} />
      <Pagination.Prev
        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
      />

      {currentPage > 2 && (
        <Pagination.Item onClick={() => paginate(1)}>{1}</Pagination.Item>
      )}
      {currentPage > 3 && <Pagination.Ellipsis />}

      {pageNumbers.slice(currentPage - 2, currentPage + 1).map((number) => (
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => paginate(number)}
        >
          {number}
        </Pagination.Item>
      ))}

      {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
      {currentPage < totalPages - 1 && (
        <Pagination.Item onClick={() => paginate(totalPages)}>
          {totalPages}
        </Pagination.Item>
      )}

      <Pagination.Next
        onClick={() =>
          paginate(currentPage < totalPages ? currentPage + 1 : totalPages)
        }
      />
      <Pagination.Last onClick={() => paginate(totalPages)} />
    </Pagination>
  );
}

export default AdvancedPagination;
