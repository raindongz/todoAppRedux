import React, { useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";
import { useDispatch, useSelector } from "react-redux";
import TodoItemService from "../Services/TodoItemService";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import {
  DELETE_ITEM,
  MOVE_ITEM,
  TOGGLE_COMPLETE_ITEM,
  UPDATE_ITEM,
} from "../redux/actionTypes/ItemActionTypes";
import { ColorButton, MenuProps } from "../UIStyles/TodoItemStyles";
import CustomizedSnackbars from "../MaterialUIComponents/SnackBar";

interface itemInterface {
  id: string;
  listId: string;
}

function TodoItem(props: itemInterface) {
  const selectLists = (state: any) => {
    return state.todoLists.map((list: any) => list);
  };
  const selectItemById = (state: any, id: any) => {
    return state.todoItems.find((item: itemInterface) => item.id === id);
  };
  const item = useSelector((state) => selectItemById(state, props.id));
  const todoLists = useSelector(selectLists);
  const dispatch = useDispatch();

  //variable for move item window open
  const [moveItemWindowOpen, setMoveItemWindowOpen] = useState(false);

  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const handleSnackBarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };
  //set dragdown menu stuff
  const [
    currentDragDownMenuList,
    setCurrentDragDownMenuList,
  ] = useState<TodoListModel>();
  function handleDragDownMenuChange(event: any) {
    setCurrentDragDownMenuList(
      todoLists.find((list: any) => list.listId === event.target.value)!
    );
  }

  function handleTodoUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    //prepare the new Item
    const newItem = {
      ...item,
      content: event.target.value,
    };
    TodoItemService.updateItem(newItem).then((response) => {
      if (response.data) {
        console.log(response.data.content);
        dispatch({
          type: UPDATE_ITEM,
          id: response.data.id,
          content: response.data.content,
        });
      }
    });
  }
  function handleTodoComplete() {
    const newItem = {
      ...item,
      completed: !item.completed,
    };
    TodoItemService.updateItem(newItem).then((response) => {
      if (response.data) {
        dispatch({ type: TOGGLE_COMPLETE_ITEM, id: response.data.id });
      }
    });
  }
  function handleTodoRemove() {
    setSnackBarOpen(true);
    TodoItemService.deleteItem(props.listId, props.id).then((response) => {
      if (response.data) {
        dispatch({
          type: DELETE_ITEM,
          id: item.id,
        });
      }
    });
  }
  //move Item to another list
  //move Item to another list
  function handleMoveItemClick() {
    setMoveItemWindowOpen(true);
  }
  function handleMoveItemWindowClose() {
    setMoveItemWindowOpen(false);
  }
  function handleMoveItemToList() {
    TodoItemService.moveItem(
      props.listId,
      props.id,
      currentDragDownMenuList!.listId
    )
      .then((response) => {
        if (response.data) {
          dispatch({
            type: MOVE_ITEM,
            id: item.id,
            targetId: currentDragDownMenuList!.listId,
          });
        }
      })
      .catch((e) => console.log(e));
    setMoveItemWindowOpen(false);
  }

  return (
    <Grid container spacing={1} className="todo-item">
      <Grid>
        <CustomizedSnackbars
          severity={"success"}
          snackBarOpen={snackBarOpen}
          handleSnackBarClose={handleSnackBarClose}
        />
        {/*move Item Window dialog*/}
        <div>
          <Dialog
            open={moveItemWindowOpen}
            onClose={handleMoveItemWindowClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
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
                  list.listId !== props.listId ? (
                    <MenuItem value={list.listId}>{list.listName}</MenuItem>
                  ) : null
                )}
              </Select>
            </FormControl>

            <DialogActions>
              <Button autoFocus onClick={handleMoveItemToList} color="primary">
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
      </Grid>
      <Grid className="todo-item-input-wrapper" item xs={5}>
        <TextField
          className="standard-basic"
          style={{
            textDecoration: item.completed ? "line-through" : undefined,
          }}
          value={item.content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleTodoUpdate(e)
          }
        />
      </Grid>
      <Grid item xs={5}>
        {item.completed ? (
          <Button
            variant="outlined"
            color="primary"
            className="complete-button"
            onClick={handleTodoComplete}
          >
            Completed
          </Button>
        ) : (
          <ColorButton
            variant="contained"
            color="primary"
            className="complete-button"
            onClick={handleTodoComplete}
          >
            Complete
          </ColorButton>
        )}
      </Grid>
      <Grid item xs={1}>
        <IconButton aria-label="delete" className="item-remove">
          <DeleteIcon
            fontSize="small"
            className="delete-icon"
            onClick={handleTodoRemove}
          />
        </IconButton>
      </Grid>
      <Grid item xs={1}>
        <IconButton className="move-item-button">
          <PresentToAllIcon fontSize="small" onClick={handleMoveItemClick} />
        </IconButton>
      </Grid>
    </Grid>
  );
}
export default TodoItem;
