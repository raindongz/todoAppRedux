import http from "./Httprequest";

const createItem=(newItem:any)=>{
    return http.post(`/lists/${newItem.listId}/items`,newItem);
}
const updateItem=(newItem:any)=>{
    return http.put(`/lists/${newItem.listId}/items`,newItem);
}
const deleteItem=(listId:string, itemId:string)=> {
    return http.delete(`/lists/${listId}/items/${itemId}`);
}
const getAllItems=(listId:string)=>{
    return http.get(`/lists/${listId}/items`)
}
const moveItem=(listId:string, itemId:string, targetListId:string)=>{
    return http.post(`/lists/${listId}/items/${itemId}?targetId=${targetListId}`);
}
export default {
    createItem,
    updateItem,
    deleteItem,
    getAllItems,
    moveItem,
};