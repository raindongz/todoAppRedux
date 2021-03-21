import http from "./Httprequest";


//List CRUD
const getAll = () => {
    return http.get("/lists");
};

const get = (id:string) => {
    return http.get(`/lists/${id}`);
};

const create = (newList:any) => {
    return http.post("/lists", newList);
};

const update = (newList:any) => {
    return http.put("/lists", newList);
};

const remove = (id:any) => {
    return http.delete(`/lists/${id}`);
};

const removeAll = () => {
    return http.delete(`/lists`);
};


export default {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
};