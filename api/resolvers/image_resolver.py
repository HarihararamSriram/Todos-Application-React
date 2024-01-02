from ariadne import convert_kwargs_to_snake_case

from api.models.todo import Todo


@convert_kwargs_to_snake_case
def resolve_images(obj, _, todo_id):
    images = Todo.query.get(todo_id).images
    image_paths = [img.file_name for img in images]
    print(image_paths)
    
    return image_paths