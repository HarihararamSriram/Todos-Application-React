from ariadne import ObjectType, make_executable_schema, load_schema_from_path, snake_case_fallback_resolvers
from api.resolvers import resolve_todos
from api.resolvers.todo_resolver import resolve_create_todo, resolve_delete_todo, resolve_mark_todo, resolve_todo, resolve_todos, resolve_update_todo

query = ObjectType("Query")

query.set_field("todos", resolve_todos)
query.set_field("todo", resolve_todo)

mutation = ObjectType("Mutation")
mutation.set_field("createTodo", resolve_create_todo)
mutation.set_field("deleteTodo", resolve_delete_todo)
mutation.set_field("markTodo", resolve_mark_todo)
mutation.set_field("updateTodo", resolve_update_todo)

type_defs = load_schema_from_path("./api/schemas/schema.graphql")
schema = make_executable_schema(
    type_defs, query, mutation, snake_case_fallback_resolvers
)
