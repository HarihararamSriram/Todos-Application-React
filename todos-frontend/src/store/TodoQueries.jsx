import { gql } from '@apollo/client';

export const ALL_TODO_QUERY = gql`
    query getTodos($username: String!) {
        todos(username: $username) {
            data {
                id
                title
                description
                dueTime
                completed
            }
        }
        error
        isTokenActive
    }
`;

export const ADD_TODO_QUERY = gql`
    mutation AddTodo(
        $title: String!
        $description: String
        $dueTime: String!
        $userName: String!
    ) {
        createTodo(
            title: $title
            description: $description
            dueTime: $dueTime
            userName: $userName
        ) {
            data {
                id
                title
                description
                dueTime
                completed
            }
        }
    }
`;

export const DELETE_TODO_QUERY = gql`
    mutation DelTodo($todoId: ID!, $removeIndex: Int!) {
        deleteTodo(todoId: $todoId, removeIndex: $removeIndex) {
            removeIndex
        }
    }
`;

export const TOGGLE_TODO_QUERY = gql`
    mutation ToggTodo($todoId: ID!, $editIndex: Int!) {
        markTodo(todoId: $todoId, editIndex: $editIndex) {
            index
            data {
                title
            }
        }
    }
`;

export const EDIT_TODO_QUERY = gql`
    mutation ToggTodo(
        $todoId: ID!
        $title: String
        $description: String
        $dueTime: String
        $editIndex: Int
    ) {
        updateTodo(
            todoId: $todoId
            title: $title
            description: $description
            dueTime: $dueTime
            editIndex: $editIndex
        ) {
            index
            data {
                id
                title
                description
                dueTime
                completed
            }
        }
    }
`;
