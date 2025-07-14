import { app } from "../../scripts/app.js";

// URL parameter workflow loading functionality
// Compatible with master branch ComfyUI architecture

function needLoadPrebuiltWorkflow(workflowId) {
    var loaded = localStorage.getItem('PrebuiltWorkflowId' + workflowId);
    if (loaded) {
        return false;
    } else {
        localStorage.setItem('PrebuiltWorkflowId' + workflowId, true);
        return true;
    }
}

async function getWorkflow() {
    let flow_json = null;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const workflowId = urlParams.get('workflow');
    const forceLoad = urlParams.get('force-load');

    if (workflowId && (forceLoad || needLoadPrebuiltWorkflow(workflowId))) {
        console.log(`Loading workflow: ${workflowId}`);
        
        // Try multiple locations for workflow files
        const locations = [
            `../workflows/${workflowId}/${workflowId}.json`,
            `../external-workflows/${workflowId}/${workflowId}.json`,
            `../workflows/${workflowId}.json`,
            `../external-workflows/${workflowId}.json`
        ];
        
        for (const location of locations) {
            try {
                console.log(`Trying location: ${location}`);
                const response = await fetch(location);
                if (response.ok) {
                    flow_json = await response.json();
                    console.log(`Successfully loaded workflow from: ${location}`);
                    break;
                } else {
                    console.log(`Location not found: ${location} (status: ${response.status})`);
                }
            } catch (error) {
                console.log(`Error trying location ${location}:`, error);
            }
        }
        
        if (!flow_json) {
            console.error(`Failed to load workflow: ${workflowId} from any location`);
        }
    }
    return flow_json;
}

// Register the extension
app.registerExtension({
    name: "Comfy.WorkflowLoader",
    
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // This runs before node registration
    },
    
    async init(app) {
        // This runs after the app is initialized
        console.log("WorkflowLoader extension initialized");
    },
    
    async setup(app) {
        // This runs after nodes are registered but before the UI is ready
        console.log("WorkflowLoader extension setup");
        
        // Load workflow from URL parameters
        const workflow = await getWorkflow();
        
        if (workflow) {
            console.log("Loading workflow from URL parameters");
            try {
                await app.loadGraphData(workflow);
                console.log("Workflow loaded successfully");
            } catch (error) {
                console.error("Failed to load workflow:", error);
                app.ui.dialog.show(`Failed to load workflow: ${error.message}`);
            }
        }
    }
});