import { useEffect, useState } from "react";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";

import "./homepage.css";

export const Homepage = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const [todosPerPage, setTodosPerPage] = useState(5);

  const handleShowMoreTodos = () => {
    setTodosPerPage(todosPerPage + todosPerPage);
  };

  const slice = todos.slice(0, todosPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      uidd: uidd,
    });

    setTodo("");
  };

  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      tempUidd: tempUidd,
    });

    setTodo("");
    setIsEdit(false);
  };

  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));

    setTodos((prev) => prev.filter((todo) => todo.id !== uid));
  };

  return (
    <div className="homepage-container">
      <button className="button-signout" onClick={handleSignOut}>
        SignOut
      </button>
      <form className="form-input">
        <input
          className="homepage-container__input"
          type="text"
          placeholder="Add todo..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
      </form>
      {slice.map((todo, idx) => (
        <div className="homepage-container__todo-list">
          <h3 key={idx} className="todo-list__title">
            {todo.todo}
          </h3>
          {/* <input className="input-check" type="checkbox" value={todos} /> */}
          <button className="button-update" onClick={() => handleUpdate(todo)}>
            Update
          </button>
          <button
            className="button-delete"
            onClick={() => handleDelete(todo.uidd)}
          >
            Delete
          </button>
        </div>
      ))}
      <button className="load-more" onClick={handleShowMoreTodos}>
        Load more
      </button>
      {isEdit ? (
        <div>
          <button
            className="homepage-container__input-button"
            onClick={handleEditConfirm}
          >
            Confirm
          </button>
        </div>
      ) : (
        <div>
          <button
            type="submit"
            className="homepage-container__input-button"
            onClick={writeToDatabase}
            disabled={!todo.length}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};
