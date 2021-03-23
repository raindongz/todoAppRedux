import React from "react";
import TodoItemService from "../../Services/TodoItemService";
import * as ItemActionTypes from "../actionTypes/ItemActionTypes"

const initialState:TodoItemModel[] = [];

function TodoItemReducer(state = initialState, action:ItemAction) {
  switch (action.type) {
    //add todo item
    case ItemActionTypes.GET_ALL_ITEMS:{
      return action.items;
    }
    case ItemActionTypes.ADD_ITEM: {
      return [
          ...state,
        {
          id: action.todoItem.id,
          content: action.todoItem.content,
          completed: action.todoItem.completed,
          listId: action.todoItem.listId,
          userId: action.todoItem.userId,
          createdDate: action.todoItem.createdDate,
          lastModifiedDate: action.todoItem.lastModifiedDate,
        }
      ];
    }
    //delete item
    case ItemActionTypes.DELETE_ITEM: {
      return state.filter((item)=> item.id !== action.id);
    }
    //toggle item completed state
    case ItemActionTypes.TOGGLE_COMPLETE_ITEM: {
      return state.map((item)=>{
        if(item.id === action.id){
          return {
            ...item,
            completed: !item.completed,
          }
        }
        return item;
      });
    }

    case ItemActionTypes.UPDATE_ITEM: {
      return state.map((item)=>{
        if(item.id === action.id){
          return {
            ...item,
            content:action.content,
          }
        }
        return item;
      });
    }

    case ItemActionTypes.MOVE_ITEM:{
      return state.map((item)=>{
        if(item.id === action.id){
          return {
            ...item,
            listId: action.targetId,
          }
        }
        return item;
      })
    }

    case ItemActionTypes.DELETE_ALL_ITEMS :{
      return [];
    }

    default:
      return state;
  }
}

export default TodoItemReducer;
