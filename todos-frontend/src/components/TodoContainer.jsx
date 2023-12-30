import Todo from './Todo';
import TodoForm from './TodoForm';
import styles from './TodoContainer.module.css';
import { useContext, useEffect } from 'react';
import TodoContext from '../store/Todo-Context';
import { useMutation } from '@apollo/client';
import {
    ADD_TODO_QUERY,
    DELETE_TODO_QUERY,
    TOGGLE_TODO_QUERY,
} from '../store/TodoQueries';

const [ADD, DEL, EDIT, TOGGLE_COMPLETE, ERROR] = [1, 2, 3, 4, 5];

function TodoContainer({ username }) {
    const todoCtx = useContext(TodoContext);
    const { dispatch, todos, loading } = todoCtx;

    const [
        createTodo,
        { data: data_add, loading: loading_add, error: error_add },
    ] = useMutation(ADD_TODO_QUERY);

    const [
        deleteTodo,
        { data: data_del, loading: loading_del, error: error_del },
    ] = useMutation(DELETE_TODO_QUERY);

    const [
        markTodo,
        { data: data_tog, loading: loading_tog, error: error_tog },
    ] = useMutation(TOGGLE_TODO_QUERY);

    useEffect(() => {
        if (!loading_add) {
            if (data_add) {
                console.log(data_add);
                dispatch({ type: ADD, newTodo: data_add.createTodo.data });
            }
        }
        if (error_add) {
            dispatch({ type: ERROR, message: error_add.message });
        }
    }, [loading_add, error_add]);

    useEffect(() => {
        if (!loading_del && data_del) {
            console.log(data_del);
            dispatch({
                type: DEL,
                removeIndex: data_del.deleteTodo.removeIndex,
            });
        }
        if (error_del) {
            dispatch({ type: ERROR, message: error_del.message });
        }
    }, [loading_del, error_del]);

    useEffect(() => {
        if (!loading_tog && data_tog) {
            console.log(data_tog);
            dispatch({
                type: TOGGLE_COMPLETE,
                editIndex: data_tog.markTodo.index,
            });
        }
        if (error_tog) {
            dispatch({ type: ERROR, message: error_tog.message });
        }
    }, [loading_tog, error_tog]);

    const addTodoFunc = (newTodo) => {
        createTodo({ variables: { ...newTodo, userName: username } });
    };

    const deleteTodoFunc = (removeIndex) => {
        deleteTodo({
            variables: { todoId: todos[removeIndex].id, removeIndex },
        });
        // dispatch({ type: DEL, removeIndex });
    };

    const toggleComplete = (editIndex) => {
        markTodo({ variables: { todoId: todos[editIndex].id, editIndex } });
    };

    const editTodo = (editIndex, changes) => {
        dispatch({
            type: EDIT,
            changes: changes,
            editIndex: editIndex,
        });
    };

    return (
        <>
            <TodoForm addTodo={addTodoFunc} />
            <div className={styles['todo-list-container']}>
                {!loading &&
                    todos &&
                    todos.map((todo, index) => {
                        return (
                            <Todo
                                key={todo['id']}
                                index={index}
                                toggleComplete={() => toggleComplete(index)}
                                editTodo={(changes) => editTodo(index, changes)}
                                deleteTodo={() => deleteTodoFunc(index)}
                                {...todo}
                            />
                        );
                    })}
            </div>
        </>
    );
}

export default TodoContainer;
