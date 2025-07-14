# ComfyUI Workflow Loading

This directory contains prebuilt workflows that can be loaded via URL parameters.

## Usage

### Load a workflow via URL parameters:

```
http://localhost:8188/?workflow=WORKFLOW_ID
```

### Force reload a workflow (bypass localStorage cache):

```
http://localhost:8188/?workflow=WORKFLOW_ID&force-load=true
```

## Directory Structure

Each workflow should be in its own directory with the following structure:

```
workflows/
└── your_workflow/
    └── your_workflow.json
```

## Adding New Workflows

1. Create a new directory under `web/workflows/` with your workflow name
2. Save your workflow as a JSON file with the same name as the directory
3. The workflow will be accessible at `?workflow=your_workflow_name`

## Examples

- Basic example: `http://localhost:8188/?workflow=example`
- Simple test: `http://localhost:8188/?workflow=simple`
- Force reload: `http://localhost:8188/?workflow=example&force-load=true`

## Technical Details

- Workflows are cached in localStorage after first load
- Use `force-load=true` to bypass the cache
- The extension automatically loads workflows on app startup
- Compatible with master branch ComfyUI architecture