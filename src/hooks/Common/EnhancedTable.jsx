import PropTypes from "prop-types";
import { usePagination, useSortBy, useTable } from "react-table";
import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { times } from "lodash";
import { styled } from "@mui/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  // [`&.${tableCellClasses.head}`]: {
  //   backgroundColor: theme.palette.background.default,
  //   color: theme.palette.common.white,
  // },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: "#efefef",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const EnhancedTable = ({
  columns,
  data,
  onRowClick,
  isLoading,
  hasPagination = false,
  setPageIndex,
  setPageSize,
  totalPages,
  pageSize,
  pageIndex,
}) => {
  const { getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  const handleChangePage = (event, newPage) => {
    setPageIndex(Number(newPage));
  };
  console.log(rows, "rows");

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <TableContainer className="custom_table riskTable">
      <Table {...getTableProps()} aria-label="customized table">
        <TableHead className="bg-[#9399AB] text-white">
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <StyledTableCell
                  className="!text-white text-[12px] !font-normal py-[2px]"
                  key={idx}
                  sx={{ minWidth: "150px" }}
                  {...column.getSortByToggleProps()}
                >
                  {column.render("Header")}
                  <TableSortLabel
                    sx={{ display: "inline-block" }}
                    active={column.isSorted}
                    direction={column.isSortedDesc ? "desc" : "asc"}
                  />
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        {isLoading ? (
          <TableBody>
            {times(10, String).map((val) => (
              <StyledTableRow key={val}>
                {columns.map((_val, idx) => (
                  <StyledTableCell key={idx} className=" py-[2px]">
                    <Skeleton animation="wave" />
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <StyledTableRow
                  hover
                  sx={{ cursor: "pointer" }}
                  {...row.getRowProps()}
                  onClick={(ev) => onRowClick && onRowClick(ev, row)}
                >
                  {row.cells.map((cell) => {
                    const accessor = cell.column.id;
                    const cellProps = cell.getCellProps();
                    const backgroundColor =
                      accessor === "severityLevel" ? row.original.color : null;

                    return (
                      <StyledTableCell
                        {...cellProps}
                        component="th"
                        scope="row"
                        className={`px-6 text-start text-[#333]  !text-[14px] py-3 font-normal`}
                      >
                        <span
                          className={` ${
                            accessor === "severityLevel" ? "active" : ""
                          }`}
                          style={{
                            backgroundColor,
                            width: "16px",
                            height: "16px",
                            borderRadius: "100%",
                            display: "inline-block",
                            position: "relative",
                            top: "3px",
                            marginRight: "7px",
                          }}
                        >
                          {accessor === "severityLevel" && ""}
                        </span>

                        {cell.render("Cell")}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
      {hasPagination && (
        <TablePagination
          component="div"
          classes={{
            root: "flex-shrink-0 border-t-1",
          }}
          rowsPerPageOptions={[
            5,
            10,
            25,
            { label: "All", value: data.length + 1 },
          ]}
          colSpan={5}
          count={totalPages * pageSize}
          rowsPerPage={pageSize}
          page={pageIndex}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: false,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </TableContainer>
  );
};

EnhancedTable.defaultProps = {
  onRowClick: () => {},
};

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  onRowClick: PropTypes.func,
};

export default EnhancedTable;
