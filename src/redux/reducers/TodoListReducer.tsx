import React, { useEffect } from "react";
import TodoListService from "../../Services/TodoListService";
import { TodoListModel } from "../../moduls";

let initialState:TodoListModel[]=[];


function TodoListReducer(state = initialState, action: any) {

  switch (action.type) {
    //add Todo List
    case "GET_ALL_LIST":{
      return action.payload
    }
    case "ADD_LIST": {
      return [
        ...state,
        {
          listId: action.payload.listId,
          listName: action.payload.listName,
          userId: action.payload.userId,
          items: action.payload.items,
        },
      ];
    }
    case "DELETE_LIST": {
      return state.filter((list) => list.listId !== action.payload);
    }
    case "CHANGE_LIST_NAME": {
      return state.map((list) => {
        if (list.listId === action.payload.listId) {
          return {
            ...list,
            listName: action.payload.listName,
          };
        }
        return list;
      });
    }

    case "DELETE_ALL_LIST": {
      return [];
    }
    default:
      return state;
  }
}
export default TodoListReducer;
