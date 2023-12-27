import { useState, useRef, useEffect } from 'react';
import CheckBox from './CheckBox';
import styles from './Todo.module.css';
import delSvg from '../assets/del.svg';

function Todo({
    description,
    title,
    dueTime,
    completed,
    toggleComplete,
    deleteTodo,
    editTodo,
}) {
    const helper = (date) => {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        if (month.toString().length == 1) {
            month = '0' + month;
        }
        if (day.toString().length == 1) {
            day = '0' + day;
        }
        if (hour.toString().length == 1) {
            hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            minute = '0' + minute;
        }
        var dateTime =
            day + '-' + month + '-' + year + ' ' + hour + ':' + minute;
        return dateTime;
    };

    const todoStyle = `${styles['todo']} ${
        completed ? styles['todo-checked'] : ''
    }`;
    const formInputRef = useRef(null);
    const [editMode, setEditMode] = useState([false, null]);

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
    return (
        <div className={todoStyle}>
            {!editMode[0] && (
                <>
                    <CheckBox
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

                        <div onClick={() => todoClickHandler('dueTime')}>
                            {helper(new Date(dueTime))}
                        </div>
                    </div>

                    <button onClick={deleteTodo}>
                        <img src={delSvg} />
                    </button>
                </>
            )}
            {editMode[0] && (
                <form
                    className={styles['todo-edit-form']}
                    onSubmit={(e) => {
                        e.preventDefault();
                        setEditMode([false, null]);
                    }}
                    onBlur={() => {
                        setEditMode([false, null]);
                    }}
                >
                    {editMode[1] === 'description' && (
                        <input
                            ref={formInputRef}
                            value={description}
                            onChange={(e) =>
                                editModeInputChangeHandler(e, 'description')
                            }
                        />
                    )}
                    {editMode[1] === 'title' && (
                        <input
                            ref={formInputRef}
                            value={title}
                            onChange={(e) =>
                                editModeInputChangeHandler(e, 'title')
                            }
                        />
                    )}
                    {editMode[1] === 'dueTime' && (
                        <input
                            type="datetime-local"
                            ref={formInputRef}
                            value={dueTime}
                            onChange={(e) =>
                                editModeInputChangeHandler(e, 'dueTime')
                            }
                        />
                    )}
                </form>
            )}
        </div>
    );
}

export default Todo;
