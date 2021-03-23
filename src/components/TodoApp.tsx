import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  DialogContentText,
  Grid,
  makeStyles,
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
import { useDispatch, useSelector } from "react-redux";
import TodoList from "./TodoList";
import TodoListService from "../Services/TodoListService";
import TodoItemService from "../Services/TodoItemService";
import {
  ADD_LIST,
  CHANGE_LIST_NAME,
  DELETE_ALL_LIST,
  DELETE_LIST,
  GET_ALL_LIST,
} from "../redux/actionTypes/ListActionTypes";
import {
  DELETE_ALL_ITEMS,
  GET_ALL_ITEMS,
} from "../redux/actionTypes/ItemActionTypes";
import { a11yProps, TabPanel, useAppStyles } from "../UIStyles/TodoAppStyle";
import ListAlreadyExistHandler from "../ErrorHandler/ListAlreadyExistHandler";

//get all lists from state
const selectLists = (state: any) => {
  return state.todoLists.map((list: any) => list);
};
//todo App function starts here
export default function TodoApp() {
  const classes = useAppStyles();
  //setup selector
  const todoLists = useSelector(selectLists);
  //set up dispatch
  const dispatch = useDispatch();
  //input for change List name and add newList
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputState, setInputState] = React.useState("");

  //variable for switch list name change model and add new list model
  const [showForChange, setShowForChange] = useState(false);

  //popup window for change list name and add new list
  const [open, setOpen] = React.useState(false);

  //current List user is viewing, will be set when user click the tab
  const [currentList, setCurrentList] = useState<TodoListModel>();

  //dialog for list name already exist pop up window
  const [listExistWindowOpen, setListExistWindowOpen] = useState(false);

  //selected is for current tab and panel, currentList Id is for select the list with clicking the tab
  const [selected, setSelected] = useState(0);

  //retrieve all lists from data base and setup initial state
  useEffect(() => {
    TodoListService.getAll().then((response) => {
      if (response.data) {
        dispatch({ type: GET_ALL_LIST, todoLists: response.data });
      }
    });
  }, []);
  //retrieve current list items from database based on current List and setup as initial state
  //will load every time when user click different tab
  useEffect(() => {
    if (currentList) {
      TodoItemService.getAllItems(currentList.listId).then((response) => {
        if (response.data) {
          dispatch({ type: GET_ALL_ITEMS, items: response.data });
        }
      });
    }
  }, [currentList?.listId]);

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
      const newList = {
        ...currentList,
        listName: listName,
      };
      TodoListService.update(newList)
        .then((response) => {
          if (response.data) {
            dispatch({
              type: CHANGE_LIST_NAME,
              listId: currentList!.listId,
              listName: listName,
            });
          }
        })
        .catch((error) => {
          console.log(error.response);
          setListExistWindowOpen(true);
        });

      setShowForChange(false);
      setOpen(false);
    }
  }

  //call data base to delete list name
  const deleteList = () => {
    if (currentList) {
      TodoListService.remove(currentList.listId).then((response) => {
        if (response.data) {
          dispatch({ type: DELETE_LIST, listId: currentList.listId });
        }
      });
    }
    //set current tab
    setSelected(0);
    setCurrentList(todoLists[0]);
  };

  //add new list
  const addNewList = (listName: string) => {
    if (listName.trim() === "") {
      return;
    }
    const newList = {
      listId: "",
      listName: listName,
      userId: "RUNDONG",
      items: [],
    };
    TodoListService.create(newList)
      .then((response) => {
        if (response.data) {
          dispatch({
            type: ADD_LIST,
            List: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error.toString());
        console.log(error.response.data);
        setListExistWindowOpen(true);
      });

    setOpen(false);
    //if only one list left then
  };

  //reset whole Application
  function resetApp() {
    setShowForChange(false);
    setOpen(false);
    TodoListService.removeAll().then((response) => {
      if (response.data) {
        dispatch({ type: DELETE_ALL_LIST, payload: null });
        dispatch({ type: DELETE_ALL_ITEMS, payload: null });
      }
    });
  }
  return (
    <div className={classes.root}>
      <React.Fragment>
        <CssBaseline />
        <Container fixed>
          {/* List name already exist dialog*/}
          <ListAlreadyExistHandler
            listExistWindowOpen={listExistWindowOpen}
            listExistWindowClose={listExistWindowClose}
          />
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
