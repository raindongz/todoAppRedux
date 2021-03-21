import React from "react";
import TodoListService from "../../Services/TodoListService";

const initialState = [
  {
    listId: "0",
    listName: "list1",
    userId: "RUNDONG",
    items: [],
  },
  {
    listId: "1",
    listName: "list2",
    userId: "RUNDONG",
    items: [],
  },
];

function TodoListReducer(state = initialState, action: any) {
  switch (action.type) {
    //add Todo List
    case "ADD_LIST": {
      const newList={
        listId: "",
        listName: action.payload,
        userId:"RUNDONG",
        items:[],
      }
      TodoListService.create(newList).then((response)=>{
        const returnedList=response.data;
        return [...state, returnedList];
      })
      return state;

    }
    case "DELETE_LIST": {
      TodoListService.remove(action.payload).then((response)=>{
        if(response.data){
          return state.filter((list:any) => list.listId !== action.payload);
        }
      })
      return state;
    }
    case "CHANGE_LIST_NAME": {
      const newList=state.find((list:any)=>list.listId===action.payload.listId)
      newList!.listName=action.payload.listName;
      TodoListService.update(newList).then((response)=>{
        return state.map((list:any)=>{
          if(list.id===action.payload.listId){
            return {
              ...list,
              listName: response.data.listName,
            }
          }
          return list;
        })
      })
      return state;
    }

    default:
      return state;
  }
}
export default TodoListReducer;
