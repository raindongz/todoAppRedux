import {createStyles, Grid, GridList, makeStyles, Theme} from "@material-ui/core";
import Todoform from "./Todoform";
import TodoItem from "./TodoItem";
import React from "react";
import {useSelector} from "react-redux";
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: 720,
            height: 500,
        },
    }),
);
interface ListInterface{
    listId:string
}
const selectListById=(state:any, listId:string)=>{
return state.todoLists.find((list:ListInterface)=>list.listId===listId);
}
const selectItems=(state:any)=>state.todoItems.map((item:any)=>item);

const TodoList = (props: ListInterface) => {
    const classes = useStyles();
    const list=useSelector((state)=>selectListById(state, props.listId))
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