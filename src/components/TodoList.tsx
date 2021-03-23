import {createStyles, Grid, GridList, makeStyles, Theme} from "@material-ui/core";
import Todoform from "./Todoform";
import TodoItem from "./TodoItem";
import React from "react";
import {useSelector} from "react-redux";
import {useTodoListStyles} from "../UIStyles/TodoListStyle";

interface ListInterface{
    listId:string
}
const selectItems=(state:any)=>state.todoItems.map((item:any)=>item);

const TodoList = (props: ListInterface) => {
    const classes = useTodoListStyles();

    const items=useSelector(selectItems);
    return (
        <div className='todo-list-view'>
            <Todoform
                listId={props.listId}
            />
            <GridList className={classes.gridList}>
                <Grid>
                    {items.map((item:any)=>
                        item.listId === props.listId?  (
                            <TodoItem
                                key={item.id}
                                id={item.id}
                                listId={props.listId}
                            />
                        ) : null
                    )}

                </Grid>
            </GridList>

        </div>
    );
};

export default TodoList;