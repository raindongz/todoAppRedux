import React from "react";
import TodoItemService from "../../Services/TodoItemService";
import {TodoItemModel} from "../../moduls";

const initialState:TodoItemModel[] = [];

function TodoItemReducer(state = initialState, action: any) {
  switch (action.type) {
    //add todo item
    case "GET_ALL_ITEMS":{
      return action.payload;
    }
    case "ADD_ITEM": {
      return [
          ...state,
        {
          id: action.payload.id,
          content: action.payload.content,
          completed: action.payload.completed,
          listId: action.payload.listId,
          userId: action.payload.userId,
          createdDate: action.payload.createdDate,
          lastModifiedDate: action.payload.lastModifiedDate,
        }
      ];
    }
    //delete item
    case "DELETE_ITEM": {
      return state.filter((item)=> item.id !== action.payload);
    }
    //toggle item completed state
    case "TOGGLE_COMPLETE_ITEM": {
      return state.map((item)=>{
        if(item.id === action.payload){
          return {
            ...item,
            completed: !item.completed,
          }
        }
        return item;
      });
    }

    case "UPDATE_ITEM": {
      return state.map((item)=>{
        if(item.id === action.payload.id){
          return {
            ...item,
            content:action.payload.content,
          }
        }
        return item;
      });
    }

    case "MOVE_ITEM":{
      return state.map((item)=>{
        if(item.id === action.payload.itemId){
          return {
            ...item,
            listId: action.payload.targetId,
          }
        }
        return item;
      })
    }

    case "DELETE_ALL_ITEMS" :{
      return [];
    }

    default:
      return state;
  }
}

export default TodoItemReducer;
