import { useEffect, useState, type FormEvent } from "react";
import {
    createTodo,
    getMyTodos,
    updateTodoCompleted,
    deleteTodo,
    getTodosByDate,
    type TodoResponse,
} from "../api/todoApi";

const TodoPage = () => {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");


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

  const handleToggleCompleted = async (
    todo: TodoResponse,
    ) => {
    try {
        await updateTodoCompleted(todo.id,!todo.completed,);

        await fetchTodos();
    } catch (error) {
        console.error("Todo 완료 상태 변경 실패:",error,);

        alert("Todo 상태 변경에 실패했습니다.",);
    }
  };

  const handleDeleteTodo = async (
    id: number,
    ) => {
        const confirmed = window.confirm(
            "정말 삭제하시겠습니까?",
        );

        if (!confirmed) {return;}

        try {
            await deleteTodo(id);
            await fetchTodos();
        } 
        catch (error) {
            console.error("Todo 삭제 실패:",error,);

            alert("Todo 삭제에 실패했습니다.",);
        }
  };

  const handleSearchByDate = async () => {
  if (!selectedDate) {
    alert("조회할 날짜를 선택해주세요.");
    return;
  }

  try {
    const data = await getTodosByDate(
      selectedDate,
    );

    setTodos(data);
  } catch (error) {
    console.error(
      "날짜별 Todo 조회 실패:",
      error,
    );

    alert(
      "Todo 조회에 실패했습니다.",
    );
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
      console.error("Todo 생성 실패:",error,);
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
      {/* 날짜별 Todo 조회 */}
        <div>
            <h2>날짜별 Todo 조회</h2>

            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            <button type="button" onClick={handleSearchByDate}>조회</button>
            <button type="button" onClick={fetchTodos}>전체 보기</button>
        </div>

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

        <button type="submit" disabled={creating}>
          {creating ? "추가 중..." : "Todo 추가"}
        </button>
      </form>

      {/* Todo 목록 */}
      {todos.length === 0 ? (
        <p>등록된 Todo가 없습니다.</p>
      ) : (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                    handleToggleCompleted(todo)
                    }
                />

                <span>{todo.content}</span>

                <span>{todo.date}</span>

                <span>{todo.completed ? "완료" : "미완료"}</span>

                <button type="button" onClick={() => handleDeleteTodo(todo.id)}>
                    삭제
                </button>
                </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TodoPage;