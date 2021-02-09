import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, IconButton} from '@material-ui/core';
import { fetchStates } from '../../api/';
import styles from './States.module.css';

const State = (state) => {

    const [stateData, setStateData] = useState([]);

    // Get DATA from the API
    useEffect(() => {
        const fetchAPI = async () => {
            setStateData(await fetchStates(state));
        }
        fetchAPI();
    }, [state])

    // STYLES
    const StyledTableCell = withStyles((theme) => ({
        head: {
        //   backgroundColor: theme.palette.common.black,
        //   color: theme.palette.common.white,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontSize: '1.3rem'
        },
        body: {
          fontSize: 18,
          fontWeight: 700
        },
      }))(TableCell);

      const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }))(TableRow);

      const useStyles = makeStyles({
        table: {
          minWidth: 100,
        },
        container: {
            maxHeight: 440,
          },
      });

      // Format Numbers with commas
      function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }

      // Sort functions
      function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }
      
      function getComparator(order, orderBy) {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      }
      
      function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
      }

      // Array of Column Headings
    const headCells = [
        { id: "state", label: "STATE" },
        { id: "positive", numeric: true, label: "POSITIVE" },
        { id: "death", numeric: true, label: "DEATHS" },
        { id: "hospitalized", numeric: true, label: "HOSPITALIZED" },
    ];

    function EnhancedTableHead(props) {
        const {order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };        

    return (
                    <TableHead>
                        <TableRow>
                        {headCells.map(headCell => (
                           <StyledTableCell
                             key={headCell.id}
                             align="left"
                             width="50"
                             sortDirection={orderBy === headCell.id ? order : false}
                           >
                             <TableSortLabel
                               active={orderBy === headCell.id}
                               direction={orderBy === headCell.id ? order : "asc"}
                               onClick={createSortHandler(headCell.id)}
                             >
                               {headCell.label}
                               {orderBy === headCell.id ? (
                                 <span>
                                   {order === "desc"}
                                 </span>
                               ) : null}
                             </TableSortLabel>
                           </StyledTableCell>
                        ))}
                        </TableRow>
                    </TableHead>
    );
    }

        const [order, setOrder] = useState('asc');
        const [orderBy, setOrderBy] = useState('state');

        const handleRequestSort = (event, property) => {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
          };
        
        const classes = useStyles();

        return (
            <div>
                 {stateData.length > 1 ? (
                <div>
                <h1>State Data</h1>
                <TableContainer className={classes.container} component={Paper}>
                    <Table className={classes.table} stickyHeader aria-label="sticky table">
                        <EnhancedTableHead 
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {stableSort(stateData, getComparator(order, orderBy))
                                .map((data) => {
                                    return (
                                        <StyledTableRow key={data.state}>
                                        <StyledTableCell width='100' component="th" scope="row">
                                            {data.state}
                                        </StyledTableCell>
                                        <StyledTableCell align="left" width='50' style={{ color: 'rgba(0, 139, 139, 0.8)' }}>
                                            {formatNumber(data.positive)}
                                        </StyledTableCell>
                                        <StyledTableCell align="left" width='50' style={{ color: 'rgba(255, 0, 0, 0.8)' }}>
                                            {formatNumber(data.death)}
                                        </StyledTableCell>
                                        <StyledTableCell align="left" width='50' style={{ color: 'rgba(139, 139, 255, 0.9)' }}>
                                            {data.hospitalized > 0 ? formatNumber(data.hospitalized) : 0}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
                  ) : <h1>State Data Not Available</h1>}
            </div>
        )
    }

export default State;