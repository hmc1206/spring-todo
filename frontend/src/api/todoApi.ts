import apiClient from "./client";

export interface TodoResponse {
    id : number;
    content : string;
    date : string;
    completed: boolean;
}

export interface TodoCreateRequest {
    content : string;
    date: string;
    userId: number;
}

export const getMyTodos = async () : Promise<TodoResponse[]> => {
    const response = await apiClient.get<TodoResponse[]>(
        "/api/todos/my",
    );

    return response.data;
}

export const createTodo = async (
    data: TodoCreateRequest,
): Promise<number> => {
    const response = await apiClient.post<number>(
        "/api/todos",
        data,
    );

    return response.data;
}

//Todo 완료 상태 변경
export const updateTodoCompleted = async (
    id: number,
    completed: boolean,
): Promise<void> => {
    await apiClient.patch(
        `/api/todos/${id}`,
        null,
        {
            params: {
                completed,
            },
        },
    );
};

//Todo 삭제
export const deleteTodo = async (
    id: number,
): Promise<void> => {
    await apiClient.delete(
        `/api/todos/${id}`,
    );
};

//날짜별 Todo 조회
export const getTodosByDate = async (
    date: string
): Promise<TodoResponse[]> => {
    const response = await apiClient.get<TodoResponse[]>(
        "/api/todos/date",
        {
            params: {
                date,
            },
        },
    );

    return response.data;
}