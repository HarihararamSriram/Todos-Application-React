import { useEffect, useReducer } from 'react';
import { useQuery } from '@apollo/client';
import TodoContext from './Todo-Context';
import { ALL_TODO_QUERY } from './TodoQueries';

const [LOAD, ADD, DEL, EDIT, TOGGLE_COMPLETE, ERROR, LOADING] = [
    0, 1, 2, 3, 4, 5, 6,
];

const todoReducer = (state, action) => {
    switch (action.type) {
        case LOAD: {
            return { ...state, todos: action.todos, error: null };
        }
        case ADD: {
            let newTodos = [...state.todos];
            console.log(newTodos);
            const index = newTodos.findIndex(
                (todo) => todo.dueTime >= action.newTodo.dueTime,
            );
            newTodos.splice(index, 0, action.newTodo);
            return { ...state, todos: newTodos };
        }
        case DEL: {
            let newTodos = [...state.todos];
            return {
                ...state,
                todos: newTodos.filter(
                    (todo, index) => index !== action.removeIndex,
                ),
            };
        }
        case EDIT: {
            let newTodos = [...state.todos];
            let newTodo = { ...newTodos[action.editIndex] };
            for (const key in action.changes) {
                newTodo[key] = action.changes[key];
            }
            newTodos[action.editIndex] = newTodo;
            return { ...state, todos: newTodos };
        }
        case TOGGLE_COMPLETE: {
            let newTodos = [...state.todos];
            let newTodo = { ...newTodos[action.editIndex] };
            newTodo.completed = !newTodo.completed;
            newTodos[action.editIndex] = newTodo;
            return { ...state, todos: newTodos };
        }

        case ERROR: {
            return { ...state, error: action.message };
        }

        case LOADING: {
            return { ...state, loading: action.loading };
        }
    }
};

function TodoProvider(props) {
    const { loading, error, data } = useQuery(ALL_TODO_QUERY);

    const [state, dispatch] = useReducer(todoReducer, {
        todos: [],
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (loading) dispatch({ type: LOADING, loading: true });
        else {
            dispatch({ type: LOAD, todos: [...data.todos.data] });
            dispatch({ type: LOADING, loading: false });
        }
        if (error) dispatch({ type: ERROR, message: error });
    }, [loading, error]);

    // useEffect(() => {
    //     dispatch({ type: LOADING, loading: true });
    //     (async () => {
    //         try {
    //             const result = await client.query({
    //                 query: ,
    //             });
    //             dispatch({ type: LOAD, todos: [...result.data.todos.data] });
    //         } catch (e) {
    //             dispatch({ type: ERROR, message: e });
    //             console.log(e);
    //         }
    //     })();
    //     dispatch({ type: LOADING, loading: false });
    // }, []);
    return (
        <TodoContext.Provider
            value={{
                ...state,
                dispatch: dispatch,
            }}
        >
            {props.children}
        </TodoContext.Provider>
    );
}

export default TodoProvider;
