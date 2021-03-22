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
  Theme,
  withStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { green, purple } from "@material-ui/core/colors";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";
import { useDispatch, useSelector } from "react-redux";
import TodoItemService from "../Services/TodoItemService";
import { TodoItemModel, TodoListModel } from "../moduls";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Container from "@material-ui/core/Container";
//for style of color button

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

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  },
}))(Button);

interface itemInterface {
  id: string;
  listId: string;
}

const selectItemById = (state: any, id: any) => {
  return state.todoItems.find((item: itemInterface) => item.id === id);
};

const selectLists = (state: any) => {
  return state.todoLists.map((list: any) => list);
};

function TodoItem(props: itemInterface) {
  const item = useSelector((state) => selectItemById(state, props.id));
  const todoLists = useSelector(selectLists);
  const dispatch = useDispatch();
  //variable for move item window open
  const [moveItemWindowOpen, setMoveItemWindowOpen] = useState(false);


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
        dispatch({
          type: "UPDATE_ITEM",
          payload: { id: response.data.id, content: response.data.content },
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
        dispatch({ type: "TOGGLE_COMPLETE_ITEM", payload: response.data.id });
      }
    });
  }
  function handleTodoRemove() {
    TodoItemService.deleteItem(props.listId, props.id).then((response) => {
      if (response.data) {
        dispatch({
          type: "DELETE_ITEM",
          payload: item.id,
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
            type: "MOVE_ITEM",
            payload: {
              itemId: item.id,
              targetId: currentDragDownMenuList!.listId,
            },
          });
        }
      })
      .catch((e) => console.log(e));
    setMoveItemWindowOpen(false);
  }

  return (
    <Grid container spacing={1} className="todo-item">
      <Grid>
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
          onChange={handleTodoUpdate}
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
