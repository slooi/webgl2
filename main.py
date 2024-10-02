import os


def print_directory_structure(startpath, max_depth=None, exclude_dirs=None):
    # Default list of directories to exclude
    if exclude_dirs is None:
        exclude_dirs = ['node_modules', '.git', '.mypy_cache']
    
    for root, dirs, files in os.walk(startpath):
        # Filter out the directories in the exclude list
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        level = root.replace(startpath, '').count(os.sep)
        if max_depth is not None and level > max_depth:
            continue
        indent = '│   ' * level
        print(f'{indent}├── {os.path.basename(root)}/')
        
        for f in files:
            print(f'{indent}│   ├── {f}')

# Usage
# You can extend the exclude list by passing additional directories
print_directory_structure('.', max_depth=2, exclude_dirs=['node_modules', '.git', '.mypy_cache', '__pycache__'])
