#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)

HOOKS_DIR="$PROJECT_ROOT/hooks"

GIT_HOOKS_DIR="$PROJECT_ROOT/.git/hooks"

# Function to create a symbolic link for a hook
create_symlink() {
    local hook_name=$1
    local hook_script="$HOOKS_DIR/$hook_name"
    local hook_link="$GIT_HOOKS_DIR/$hook_name"

    if [ -f "$hook_script" ]; then
        ln -sf "$hook_script" "$hook_link"
        echo "Created symlink for $hook_name hook."
    else
        echo "Hook script not found: $hook_script"
    fi
}

remove_existing_hooks() {
    echo "Removing existing hooks..."
    rm -rf "$GIT_HOOKS_DIR"
    mkdir "$GIT_HOOKS_DIR"
}

remove_existing_hooks

create_symlink "pre-commit"

echo "Git hooks setup complete."