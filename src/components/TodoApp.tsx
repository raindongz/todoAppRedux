import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  DialogContentText,
  FormControl,
  Grid,
  GridList,
  InputLabel,
  makeStyles,
  MenuItem,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
//to install shortid 1:npm install. 2:npm install -D @types/module-name  3:npm i --save-dev shortid@2.2.15

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import CachedIcon from "@material-ui/icons/Cached";
//import snackbar
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import classes from "*.module.css";
import ListInterface from "./TodoList";
import { useDispatch, useSelector } from "react-redux";
import TodoList from "./TodoList";
import {TodoListModel} from "../moduls";

//snackbar function and style
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
//drag down menu style
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
//tab and panel declaration staff
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
//tabpanel style
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
//for matching tab and panel
function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const selectLists = (state: any) => {
  return state.todoLists.map((list: any) => list);
};
export default function TodoApp() {
  const classes = useStyles();
  //setup selector
  const todoLists = useSelector(selectLists);
  const dispatch = useDispatch();
  //input for change List name and add newList
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputState, setInputState] = React.useState("");

  //variable for switch list name change model and add new list model
  const [showForChange, setShowForChange] = useState(false);

  //current List user is viewing
  const [currentList, setCurrentList] = useState<TodoListModel>();

  //item snack bar for delete & create & move item
  const [ItemSnackBarOpen, setItemSnackbarOpen] = React.useState(false);
  const [NewItemSnackBar, setNewItemSnakeBar] = React.useState(false);
  const [moveItemSnackBarOpen, setMoveItemSnackBarOpen] = useState(false);

  //variable for move item window open
  const [moveItemWindowOpen, setMoveItemWindowOpen] = useState(false);
  //selected item user want to move
  const [currentMoveItem, setCurrentMoveItem] = useState();

  //dialog for list name already exist pop up window
  const [listExistWindowOpen, setListExistWindowOpen] = useState(false);
  //selected is for current tab and panel, currentList Id is for select the list with clicking the tab
  const [selected, setSelected] = useState(0);
  //popup window for change list name and add new list
  const [open, setOpen] = React.useState(false);

  //tab switch
  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    setSelected(newValue);
  }
  //select current list by clicking tab
  function handleCurrentListSelect(list: any) {
    setCurrentList(list);
  }

  //open the popup window for list name change and add new list
  const handleClickOpen = () => {
    setOpen(true);
  };

  //dialog functions
  function handleClose() {
    setOpen(false);
    setShowForChange(false);
  }

  //move Item to another list
  function handleMoveItemClick(item: any) {
    setMoveItemWindowOpen(true);
    setCurrentMoveItem(item);
  }
  function handleMoveItemWindowClose() {
    setMoveItemWindowOpen(false);
  }



  const ItemDeleteSnackBar = () => {
    setNewItemSnakeBar(false);
    setMoveItemSnackBarOpen(false);
    setItemSnackbarOpen(true);
  };
  const ItemDeleteSnackBarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setItemSnackbarOpen(false);
  };
  //new item snack bar
  const NewItemSnackBarOpen = () => {
    setMoveItemSnackBarOpen(false);
    setItemSnackbarOpen(false);
    setNewItemSnakeBar(true);
  };
  //close new item snackBar
  const handleNewItemClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setNewItemSnakeBar(false);
  };
  //moveitem snack bars
  function handleMoveItemSnackBarOpen() {
    setNewItemSnakeBar(false);
    setItemSnackbarOpen(false);
    setMoveItemSnackBarOpen(true);
  }
  function handleMoveItemSnackBarClose() {
    setMoveItemSnackBarOpen(false);
  }
  //List CRUD
  //List CRUD start here
  //this function is used to change list name and add new list if showForChange is
  // true then change list name, otherwise add new list
  function handleDialogSwitchOrAdd() {
    if (showForChange) {
      changeListName(inputState);
      if (inputRef && inputRef.current) {
        inputRef.current.value = "";
      }
      setInputState("");
    } else {
      if (inputState.trim() === "") {
        return;
      }
      //create list in backend
        addNewList(inputState);
      if (inputRef && inputRef.current) {
        inputRef.current.value = "";
      }
      setInputState("");
    }
  }

  //close the window for list already exist
  function listExistWindowClose() {
    setListExistWindowOpen(false);
  }

  //make the input state not refresh
  function handleListNameInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInputState(event.target.value);
  }

  //set the popup window to change list name model
  function setChangeListName() {
    setOpen(true);
    setShowForChange(true);
  }
  //call database to change the list name
  function changeListName(listName: string) {
    if (currentList) {
      if (listName.trim() === "") {
        return;
      }
    dispatch({type: "CHANGE_LIST_NAME", payload: {listId:currentList!.listId, listName:listName}})

      setShowForChange(false);
      setOpen(false);
    }
  }

  //call data base to delete list name
  const deleteList = () => {
    if (currentList) {
      dispatch({type:"DELETE_LIST", payload:currentList.listId})
    }
    //set current tab
    setSelected(0);
    setCurrentList(todoLists[0]);
    //copy.splice( -1, 1 )
    //setTodoLists( copy )
  };

  //add new list
  const addNewList = (listName:string) => {
    if (listName.trim() === "") {
      return;
    }
      dispatch({type:"ADD_LIST", payload: listName})
    setOpen(false);
    //if only one list left then
  };

  //reset whole Application
  function resetApp() {

    setShowForChange(false);
    setOpen(false);
  }
function handleDragDownMenuChange(){}
function handleMoveItemToList(){}
  return (
    <div className={classes.root}>
      <React.Fragment>
        <CssBaseline />
        <Container fixed>
          {/*snackbar for move item to another list*/}
          <Snackbar
            open={moveItemSnackBarOpen}
            autoHideDuration={6000}
            onClose={handleMoveItemSnackBarClose}
          >
            <Alert onClose={handleMoveItemSnackBarClose} severity="info">
              Successfully moved Item!
            </Alert>
          </Snackbar>
          {/*snackbar for create new item*/}
          <Snackbar
            open={NewItemSnackBar}
            autoHideDuration={6000}
            onClose={handleNewItemClose}
          >
            <Alert onClose={handleNewItemClose} severity="success">
              Successfully created Item!
            </Alert>
          </Snackbar>
          {/*snackbar for delete existing item*/}
          <Snackbar
            open={ItemSnackBarOpen}
            autoHideDuration={6000}
            onClose={ItemDeleteSnackBarClose}
          >
            <Alert onClose={ItemDeleteSnackBarClose} severity="warning">
              Delete item successful!
            </Alert>
          </Snackbar>

          {/*move Item Window dialog*/}
          <div>
            <Dialog
              open={moveItemWindowOpen}
              onClose={handleMoveItemWindowClose}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle
                style={{ cursor: "move" }}
                id="draggable-dialog-title"
              >
                choose the list you want move to
              </DialogTitle>

              <FormControl>
                <InputLabel id="demo-mutiple-name-label">List Name</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  autoFocus
                  variant="filled"
                  MenuProps={MenuProps}
                  onChange={handleDragDownMenuChange}
                >
                  {todoLists.map((list: any) =>
                    list.listId !== currentList?.listId ? (
                      <MenuItem value={list.listId}>{list.listName}</MenuItem>
                    ) : null
                  )}
                </Select>
              </FormControl>

              <DialogActions>
                <Button
                  autoFocus
                  onClick={handleMoveItemToList}
                  color="primary"
                >
                  Submit
                </Button>
                <Button
                  autoFocus
                  onClick={handleMoveItemWindowClose}
                  color="primary"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          {/* List name already exist dialog*/}
          <div>
            <Dialog
              open={listExistWindowOpen}
              onClose={listExistWindowClose}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle
                style={{ cursor: "move" }}
                id="draggable-dialog-title"
              >
                List name already exist
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please consider another List name
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  autoFocus
                  onClick={listExistWindowClose}
                  color="primary"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          {/* Change List name dialog*/}
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Change List Name</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  ref={inputRef}
                  margin="dense"
                  id="name"
                  label="Enter List Name"
                  type="email"
                  fullWidth
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleListNameInput(event)
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogSwitchOrAdd} color="primary">
                  Submit
                </Button>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          {/* Todo Application title*/}
          <Grid>
            <h1 className="title">Todo App</h1>
          </Grid>
          <Grid container spacing={3}>
            {/* create Tabs by mapping each list in todoLists*/}
            <Grid item xs={10}>
              <AppBar position="static" color="default">
                <Tabs
                  value={selected}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  {todoLists.map((todoList: any, index: any) => (
                    <Tab
                      key={todoList.listId}
                      label={todoList.listName}
                      {...a11yProps(index)}
                      onClick={() => handleCurrentListSelect(todoList)}
                    />
                  ))}
                  <Button variant="outlined" onClick={handleClickOpen}>
                    {" "}
                    +{" "}
                  </Button>
                </Tabs>
              </AppBar>
              {/* create panels by mapping each list in todoLists*/}
              {todoLists.map((todoList: any, index: any) => (
                <TabPanel index={index} value={selected}>
                  <TodoList key={todoList.listId} listId={todoList.listId} />
                </TabPanel>
              ))}
            </Grid>
            {/* Change & Delete & Reset app Buttons*/}
            <Grid container item xs={2}>
              <Grid item xs>
                <Button
                  className="change-list-button"
                  onClick={setChangeListName}
                  variant="contained"
                  color="primary"
                  startIcon={<BorderColorIcon />}
                >
                  Change Name
                </Button>
              </Grid>
              <Grid item xs>
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  className="delete-button"
                  startIcon={<DeleteIcon />}
                  onClick={deleteList}
                >
                  Delete List
                </Button>
              </Grid>
              <Grid item xs>
                <Button
                  size="large"
                  className="reset-button"
                  variant="outlined"
                  color="secondary"
                  startIcon={<CachedIcon />}
                  onClick={resetApp}
                >
                  Reset App
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    </div>
  );
}
