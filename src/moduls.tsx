export interface TodoItemModel {
    id: string,
    content: string,
    completed: boolean,
    listId:string,
    userId:string,
    createdDate:Date,
    lastModifiedDate:Date,
}

export interface TodoListModel {
    listId: string,
    listName: string,
    userId:string,
    items: string[]
}
