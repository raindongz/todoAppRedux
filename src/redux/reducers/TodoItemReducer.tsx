import React from "react";
import TodoItemService from "../../Services/TodoItemService";

const initialState:any = [];

function TodoItemReducer(state = initialState, action: any) {
  switch (action.type) {
    //add todo item
    case "ADD_ITEM": {
      const newItem={
            id: "",
            content: action.payload.content,
            completed: false,
            listId: action.payload.listId,
            userId:"RUNDONG",
            createdDate: new Date,
            lastModifiedDate:new Date,
          };
      TodoItemService.createItem(newItem).then((response)=>{
        const returnedItem=response.data;
        return [
          ...state,
          returnedItem
        ];
      })
      return state;
    }
    //delete item
    case "DELETE_ITEM": {
      TodoItemService.deleteItem(action.payload.listId, action.payload.itemId).then((response)=>{
        if(response.data){
          return state.filter((item:any) => item.id !== action.payload);
        }
      })
      return ;
    }
    //toggle item completed state
    case "TOGGLE_COMPLETE_ITEM": {
      const newItem=state.find((item:any)=>item.id===action.payload);
      newItem.completed=!newItem.completed;
      TodoItemService.updateItem(newItem).then((response)=>{
        return state.map((item:any) => {
          if (item.id === response.data.id) {
            return {
              ...item,
              completed: !item.completed,
            };
          }
          return item;
        });
      })
      return state;
    }

    case "UPDATE_ITEM": {
      const newItem=state.find((item:any)=>item.id===action.payload.id);
      newItem.content=action.payload.content;
      TodoItemService.updateItem(newItem).then((response)=>{
        return state.map((item:any) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              content: response.data.content,
            };
          }
          return item;
        });
      })
      return state;
    }
    default:
      return state;
  }
}

export default TodoItemReducer;
