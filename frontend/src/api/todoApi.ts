import apiClient from "./client";

export interface TodoResponse {
    id : number;
    content : string;
    date : string;
    completed: boolean;
}

export const getMyTodos = async () : Promise<TodoResponse[]> => {
    const response = await apiClient.get<TodoResponse[]>(
        "/api/todos/my",
    );

    return response.data;
}