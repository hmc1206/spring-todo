import { useEffect, useState, type FormEvent } from "react";
import {
    createTodo,
    getMyTodos,
    type TodoResponse,
} from "../api/todoApi";

const TodoPage = () => {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");


  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchTodos = async () => {
    try {
      const data = await getMyTodos();

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

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("할 일을 입력해주세요.");
      return;
    }

    if (!date) {
      alert("날짜를 선택해주세요.");
      return;
    }

    try {
      setCreating(true);

      await createTodo({
        content,
        date,
        userId: 5,
      });

      setContent("");
      setDate("");

      await fetchTodos();
    } catch (error) {
      console.error(
        "Todo 생성 실패:",
        error,
      );

      alert("Todo 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div>Todo를 불러오는 중...</div>;
  }

  return (
    <div>
      <h1>내 Todo</h1>

      {/* Todo 생성 */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          placeholder="할 일을 입력하세요"
        />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={creating}
        >
          {creating
            ? "추가 중..."
            : "Todo 추가"}
        </button>
      </form>

      {/* Todo 목록 */}
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