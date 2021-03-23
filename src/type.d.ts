interface TodoItemModel {
  id: string;
  content: string;
  completed: boolean;
  listId: string;
  userId: string;
  createdDate: Date;
  lastModifiedDate: Date;
}

interface TodoListModel {
  listId: string;
  listName: string;
  userId: string;
  items: string[];
}

type ListAction = {
  type: string;
  listId: string;
  listName: string;
  userId: string;
  items: string[];
  List:TodoListModel;
  todoLists:TodoListModel[];
};

type ItemAction = {
  type: string;
  items:TodoItemModel[];
  todoItem:TodoItemModel;
  id: string;
  content: string;
  completed: boolean;
  listId: string;
  userId: string;
  createdDate: Date;
  lastModifiedDate: Date;
  targetId:string;
};
