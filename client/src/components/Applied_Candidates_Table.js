import React, { useEffect,  useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import "../componentsStyles/Admin_Quiz_Table.css"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import axios from 'axios';
import moment from "moment";   
import {Link, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Loader from "react-loader-spinner";

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

const headCells = [
  { id: 'Name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'Phone Number', numeric: true, disablePadding: false, label: 'Phone Number' },
  { id: 'Experience', numeric: true, disablePadding: false, label: 'Experience' },
  { id: 'Qualification', numeric: true, disablePadding: false, label: 'Qualification' },
  { id: 'Career Level', numeric: true, disablePadding: true, label: "Career Level" },
  { id: 'actions', numeric: true, disablePadding: true, label: "Actions" },
];
function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
           >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              className = {"table__header__mui"}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {
      })}
    >
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Following Candidates have applied for this post
      </Typography>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    left: '30%',
    margin: 'auto',
    border: '5px',
    padding: '10px',
    marginRight: "410px"
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  loader :{
    position: "relative !important",
    top : "20px !important"
  }
}));


export default function Applied_Candidates_Table({user}) {
  const {id} = useParams();
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('Experience');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const Loading = () => {
    return (  
        <Loader className= {classes.loader} type="TailSpin" color="#00BFFF" height={100} width={100}/>
    )
  }
  const handleRequestSort = (event) => {
    const isAsc =  order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
  };


  const handleClick = (event, testID) => {
    const selectedIndex = selected.indexOf(testID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, testID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    
    setSelected(newSelected);
    console.log("selected now = ",selected)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, tests?.length - page * rowsPerPage);
  
  const [tests, setTests] = useState([]);
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true);
  const token = useSelector(state => state.token) 
  const options = {
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("firstlogin"),
    },
  };
  const getCandidates = async () => {
    setLoading(true)
    await axios.post("/user/get-applied-candidates-by-postId", {postId : id} ,options).then((res) => {
      console.log("candidates fetched ",res.data)
      setCandidates(res.data)
      setLoading(false)
    })
    .catch((err) => {
      console.log(err.response.msg)
    });
  }

  useEffect(() => {  
    getCandidates()
  }, []);

  return (
    <div className={classes.root}>
    {
      (candidates.length > 0) ? (
        <>
        <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={tests?.length}
            />
            {loading && Loading }
            {loading === false &&  ( 
              <TableBody>
              {stableSort(candidates, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((candidate, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox" 
                      tabIndex={-1}
                      key={candidate._id}
                    >
                      <TableCell padding="checkbox">
                        <h1></h1>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {candidate?.name}
                      </TableCell>
                      <TableCell align="right">{candidate?.phone_number}</TableCell>
                      <TableCell align="right">{candidate?.experience}</TableCell>
                      <TableCell align="right">{candidate?.qualification}</TableCell>
                      <TableCell align="right">{candidate?.career_level}</TableCell>
                      <TableCell align="right">
                        <Link to={`/meetings/schedule-meeting`}>
                            <i className="fas fa-eye" title="Edit"></i>
                        </Link>
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow> 
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody> )}
            
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={candidates?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
        </>
      ):(
        <>
          <h1> No Candidate has applied yet for this candidate </h1>
        </>
      )
    }
    </div>
  );
}
