import { useEffect, useState } from "react";
import {
  getMyTodos,
  type TodoResponse,
} from "../api/todoApi";

const TodoPage = () => {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getMyTodos();

        console.log("내 Todo:", data);

        setTodos(data);
      } catch (error) {
        console.error(
          "Todo 조회 실패:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) {
    return <div>Todo를 불러오는 중...</div>;
  }

  return (
    <div>
      <h1>내 Todo</h1>

      {todos.length === 0 ? (
        <p>등록된 Todo가 없습니다.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <p>{todo.content}</p>
              <p>{todo.date}</p>
              <p>
                {todo.completed
                  ? "완료"
                  : "미완료"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoPage;