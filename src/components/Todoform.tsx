import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TodoItemService from "../Services/TodoItemService";

interface TodoformInterface {
  listId: string;
}

const selectListById = (state: any, id: string) => {
  return state.todoLists.find((list: any) => list.listId === id);
};
const TodoFormView = (props: TodoformInterface) => {
  const list = useSelector((state) => selectListById(state, props.listId));
  const dispatch = useDispatch();
  // Create ref for form input
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputState, setInputState] = React.useState("");

  // Handle todo input change
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Update form state with the text from input
    setInputState(event.target.value);
  }
  function handleInputEnter() {
    if (inputState.trim() === "") {
      return;
    }
    //prepare new Item
    const newItem = {
      id: "",
      content: inputState,
      completed: false,
      listId: props.listId,
      userId: "RUNDONG",
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    };
    TodoItemService.createItem(newItem).then((response) => {
      if (response.data) {
        dispatch({
          type: "ADD_ITEM",
          payload: {
            id: response.data.id,
            content: response.data.content,
            completed: response.data.completed,
              listId: response.data.listId,
              userId:response.data.userId,
              createdDate:response.data.createdDate,
              lastModifiedDate:response.data.lastModifiedDate,
          },
        });
      }
    });

    // Reset the input field
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    setInputState("");
  }
  return (
    <div className="todo-form">
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <TextField
            inputRef={inputRef}
            className="outlined-basic"
            label="Enter New Item"
            variant="outlined"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(event)
            }
          />
        </Grid>
        <Grid item xs>
          <Button
            className="add-item-button"
            onClick={() => handleInputEnter()}
            variant="outlined"
            color="primary"
            size="small"
            type="submit"
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default TodoFormView;
