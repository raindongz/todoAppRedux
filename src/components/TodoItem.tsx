import React from "react";
import {Button, Grid, IconButton, TextField, Theme, withStyles} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { green, purple } from "@material-ui/core/colors";
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import {useDispatch, useSelector} from "react-redux";
import TodoItemService from "../Services/TodoItemService";
//for style of color button

const ColorButton = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[500],
        "&:hover": {
            backgroundColor: purple[700],
        },
    },
}))(Button);

interface itemInterface{
    id:string;
    listId:string;
}

const selectItemById=(state:any, id:any)=>{
    return state.todoItems.find((item:itemInterface)=>item.id === id);
}


function TodoItem(props:itemInterface){
const item=useSelector((state)=>selectItemById(state, props.id));
const dispatch=useDispatch();

function handleTodoUpdate(event: React.ChangeEvent<HTMLInputElement>){
    dispatch({type: "UPDATE_ITEM", payload: {id:item.id, content:event.target.value}})
}
function handleTodoComplete(){
    dispatch({type:"TOGGLE_COMPLETE_ITEM", payload: item.id})
}
function handleTodoRemove(){
    dispatch({type: "DELETE_ITEM", payload: {listId:props.listId, itemId:item.id}})
}
function handleMoveItemClick(){}
return (
    <Grid
        container
        spacing={1}
        className="todo-item"
    >
        <Grid className="todo-item-input-wrapper"
              item xs={5}>
            <TextField className="standard-basic"
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
                    className='complete-button'
                    onClick={handleTodoComplete}
                >
                    Completed
                </Button>
            ) : (
                <ColorButton
                    variant="contained"
                    color="primary"
                    className='complete-button'
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
            <IconButton className='move-item-button'>
                <PresentToAllIcon
                    fontSize="small"
                    onClick={handleMoveItemClick}
                />
            </IconButton>
        </Grid>
    </Grid>
);
}
export default TodoItem;