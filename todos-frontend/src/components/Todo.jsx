import { useState, useRef, useEffect, useContext } from 'react';
import CheckBox from './CheckBox';
import styles from './Todo.module.css';
import delSvg from '../assets/del.svg';
import { EDIT_TODO_QUERY } from '../store/TodoQueries';
import TodoContext from '../store/Todo-Context';
import { useMutation } from '@apollo/client';

const dateToString = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let session = 'AM';
    if (month.toString().length == 1) {
        month = '0' + month;
    }
    if (day.toString().length == 1) {
        day = '0' + day;
    }
    if (hour.toString().length == 1) {
        hour = '0' + hour;
        session = 'PM';
    } else {
        hour = hour - 12;
    }
    if (minute.toString().length == 1) {
        minute = '0' + minute;
    }
    var dateTime =
        day + '-' + month + '-' + year + ' ' + hour + ':' + minute + session;
    return dateTime;
};
const [EDIT, ERROR] = [3, 5];

function Todo({
    index,
    id,
    description,
    title,
    dueTime,
    completed,
    toggleComplete,
    deleteTodo,
    editTodo,
}) {
    const todoStyle = `${styles['todo']} ${
        completed ? styles['todo-checked'] : ''
    }`;
    const formInputRef = useRef(null);
    const [editMode, setEditMode] = useState([false, null]);

    const todoCtx = useContext(TodoContext);
    const { dispatch } = todoCtx;

    const [
        updateTodo,
        { data: data_upd, loading: loading_upd, error: error_upd },
    ] = useMutation(EDIT_TODO_QUERY);

    useEffect(() => {
        if (!loading_upd && data_upd) {
            console.log(data_upd);
            console.log(data_upd.updateTodo.data);
            dispatch({
                type: EDIT,
                changes: data_upd.updateTodo.data,
                editIndex: data_upd.updateTodo.index,
            });
        }
        if (error_upd) {
            dispatch({ type: ERROR, message: error_upd.message });
        }
    }, [loading_upd, error_upd]);

    useEffect(() => {
        if (editMode[0]) formInputRef.current.focus();
    }, [editMode]);

    const editModeInputChangeHandler = (e, field) => {
        const obj = {};
        obj[field] = e.target.value;
        editTodo(obj);
    };
    const todoClickHandler = (field) => {
        setEditMode([true, field]);
    };

    const editSubmitHandler = (e) => {
        e.preventDefault();
        updateTodo({
            variables: {todoId: id, title, description, dueTime, editIndex: index },
        });
        setEditMode([false, null]);
    };

    return (
        <div className={todoStyle}>
            {!editMode[0] && (
                <>
                    <CheckBox
                        className={styles['todo-buttons']}
                        checked={completed}
                        toggleCheck={toggleComplete}
                    />
                    <div className={styles['todo-body']}>
                        <div>
                            <div
                                className={`${styles['todo-text']} ${styles['title']}`}
                                onClick={() => todoClickHandler('title')}
                            >
                                {title}
                            </div>
                            <div
                                className={`${styles['todo-text']} ${styles['desc']}`}
                                onClick={() => todoClickHandler('description')}
                            >
                                {description}
                            </div>
                        </div>

                        <div
                            className={styles['todo-text']}
                            onClick={() => todoClickHandler('dueTime')}
                        >
                            {dateToString(new Date(dueTime))}
                        </div>
                    </div>

                    <button
                        className={styles['todo-buttons']}
                        onClick={deleteTodo}
                    >
                        <img src={delSvg} />
                    </button>
                </>
            )}
            {editMode[0] && (
                <>
                    <button
                        className={styles['edit-done-button']}
                        type="submit"
                        form="todo-edit-form"
                    >
                        Done
                    </button>
                    <form
                        id="todo-edit-form"
                        className={styles['todo-edit-form']}
                        onSubmit={editSubmitHandler}
                        ref={formInputRef}
                    >
                        <input
                            name={'title'}
                            value={title}
                            className={`${styles['todo-text']} ${styles['title']}`}
                            onChange={(e) =>
                                editModeInputChangeHandler(e, 'title')
                            }
                        />
                        <input
                            name="description"
                            className={`${styles['todo-text']} ${styles['desc']}`}
                            value={description}
                            onChange={(e) =>
                                editModeInputChangeHandler(e, 'description')
                            }
                        />
                        <input
                            name="dueTime"
                            className={`${styles['todo-text']} ${styles['desc']}`}
                            type="datetime-local"
                            value={dueTime}
                            onChange={(e) =>
                                editModeInputChangeHandler(e, 'dueTime')
                            }
                        />
                    </form>
                </>
            )}
        </div>
    );
}

export default Todo;
