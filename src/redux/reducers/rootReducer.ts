import {combineReducers} from "redux";
import TodoItemReducer from "./TodoItemReducer";
import TodoListReducer from "./TodoListReducer";

const rootReducer=combineReducers({
    todoItems: TodoItemReducer,
    todoLists: TodoListReducer,
})

export default rootReducer;