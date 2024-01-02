import React from 'react';

const TodoContext = React.createContext({
    todos: [],
    error: null,
    loading: true,
    username: "",
    dispatch: () => {},
});

export default TodoContext;
