# ComfyUI Workflow Loading

This directory contains prebuilt workflows that can be loaded via URL parameters or command-line arguments.

## Usage

### Method 1: Command Line Arguments

Load a workflow when starting ComfyUI:

```bash
python main.py --workflow example
```

Force load a workflow (bypass cache):

```bash
python main.py --workflow example --force-load-workflow
```

Load a workflow from an external directory:

```bash
python main.py --workflow myworkflow --workflows-dir /workspace/comfyui-workflows/runcomfy-comfyui-web
```

### Method 2: URL Parameters

Load a workflow via URL parameters:

```
http://localhost:8188/?workflow=WORKFLOW_ID
```

Force reload a workflow (bypass localStorage cache):

```
http://localhost:8188/?workflow=WORKFLOW_ID&force-load=true
```

## Directory Structure

Workflows can be organized in two ways:

### Option 1: Directory per workflow (recommended)
```
workflows/
└── your_workflow/
    └── your_workflow.json
```

### Option 2: Flat structure
```
workflows/
└── your_workflow.json
```

### External Workflows Directory
You can also store workflows in an external directory:
```
/workspace/comfyui-workflows/runcomfy-comfyui-web/
├── workflow1/
│   └── workflow1.json
└── workflow2.json
```

## Adding New Workflows

1. Create a new directory under `web/workflows/` with your workflow name
2. Save your workflow as a JSON file with the same name as the directory
3. The workflow will be accessible at `?workflow=your_workflow_name`

## Examples

### CLI Examples:
- `python main.py --workflow example`
- `python main.py --workflow simple --force-load-workflow`
- `python main.py --listen 127.0.0.1 --disable-auto-launch --port 18188 --enable-cors-header --disable-auto-launch --force-load-workflow --workflow runcomfy-comfyui-web --workflows-dir /workspace/comfyui-workflows/runcomfy-comfyui-web`

### URL Examples:
- Basic example: `http://localhost:8188/?workflow=example`
- Simple test: `http://localhost:8188/?workflow=simple`
- Force reload: `http://localhost:8188/?workflow=example&force-load=true`

## Technical Details

- Workflows are cached in localStorage after first load
- Use `force-load=true` to bypass the cache
- The extension automatically loads workflows on app startup
- Compatible with master branch ComfyUI architecture
- **RunComfy-Helper Integration:** If you have RunComfy-Helper installed, it will be used for professional workflow loading
- **Template Override:** The system intelligently overrides ComfyUI's template system when URL parameters are present

## RunComfy-Helper Integration

### Install RunComfy-Helper (Recommended):
```bash
cd /workspace/ComfyUI/custom_nodes
git clone https://github.com/InceptionsAI/ComfyUI-RunComfy-Helper.git
```

### Benefits of RunComfy-Helper:
- ✅ Professional workflow loading with better error handling
- ✅ Production-ready code patterns
- ✅ Seamless integration with ComfyUI's architecture
- ✅ Automatic fallback if RunComfy-Helper fails

### API Endpoint:
- **GET** `/runcomfy/workflow/{workflow_name}` - Returns workflow JSON for integration