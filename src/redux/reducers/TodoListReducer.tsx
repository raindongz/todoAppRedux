import React, { useEffect } from "react";
import TodoListService from "../../Services/TodoListService";
import * as ListActionType from "../actionTypes/ListActionTypes"

let initialState:TodoListModel[]=[];


function TodoListReducer(state = initialState, action: ListAction) {

  switch (action.type) {
    //add Todo List
    case ListActionType.GET_ALL_LIST:{
      return action.todoLists
    }
    case ListActionType.ADD_LIST: {
      return [
        ...state,
        {
          listId: action.List.listId,
          listName: action.List.listName,
          userId: action.List.userId,
          items: action.List.items,
        },
      ];
    }
    case ListActionType.DELETE_LIST: {
      return state.filter((list) => list.listId !== action.listId);
    }
    case ListActionType.CHANGE_LIST_NAME: {
      return state.map((list) => {
        if (list.listId === action.listId) {
          return {
            ...list,
            listName: action.listName,
          };
        }
        return list;
      });
    }

    case ListActionType.DELETE_ALL_LIST: {
      return [];
    }
    default:
      return state;
  }
}
export default TodoListReducer;
