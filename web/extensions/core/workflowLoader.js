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

    if (workflowId) {
        console.log(`[WORKFLOW] Requested workflow: '${workflowId}'`);
        console.log(`[WORKFLOW] Force load parameter: '${forceLoad}'`);
        
        if (forceLoad || needLoadPrebuiltWorkflow(workflowId)) {
            console.log(`[WORKFLOW] Loading workflow: ${workflowId}${forceLoad ? ' (force-load)' : ''}`);
            
            // Try multiple locations for workflow files
            const locations = [
                `../workflows/${workflowId}/${workflowId}.json`,
                `../external-workflows/${workflowId}/${workflowId}.json`,
                `../workflows/${workflowId}.json`,
                `../external-workflows/${workflowId}.json`
            ];
            
            for (const location of locations) {
                try {
                    console.log(`[WORKFLOW] Trying location: ${location}`);
                    const response = await fetch(location);
                    if (response.ok) {
                        flow_json = await response.json();
                        console.log(`[WORKFLOW] Successfully loaded workflow from: ${location}`);
                        console.log(`[WORKFLOW] Workflow contains ${Object.keys(flow_json).length} top-level keys`);
                        break;
                    } else {
                        console.log(`[WORKFLOW] Location not found: ${location} (status: ${response.status})`);
                    }
                } catch (error) {
                    console.log(`[WORKFLOW] Error trying location ${location}:`, error);
                }
            }
            
            if (!flow_json) {
                console.error(`[WORKFLOW] Failed to load workflow: ${workflowId} from any location`);
            }
        } else {
            console.log(`[WORKFLOW] Workflow ${workflowId} already loaded, skipping (use force-load=true to reload)`);
        }
    }
    return flow_json;
}

// Register the extension
app.registerExtension({
    name: "Comfy.WorkflowLoader",
    
    async init(app) {
        console.log("WorkflowLoader extension initialized");
        this.overrideTemplateSystem(app);
    },
    
    overrideTemplateSystem(app) {
        const originalLoadGraphData = app.loadGraphData;
        
        // Override loadGraphData to check for our workflow first
        app.loadGraphData = async function(graphData, clean, workflow_info) {
            const isTemplateLoading = workflow_info && workflow_info.source === 'template';

            if (!isTemplateLoading) {
                const urlWorkflow = await getWorkflow();
                if (urlWorkflow) {
                    console.log("Overriding template with URL workflow");
                    return await originalLoadGraphData.call(this, urlWorkflow, clean, { source: 'url_params' });
                }
            }
            
            return await originalLoadGraphData.call(this, graphData, clean, workflow_info);
        };
    },
    
    async setup(app) {
        console.log("WorkflowLoader extension setup");
        const urlParams = new URLSearchParams(window.location.search);
        const workflowId = urlParams.get('workflow');
        
        if (workflowId) {
            console.log(`URL parameter workflow requested: ${workflowId}`);
            
            const usingRunComfyHelper = app.extensions?.find(ext => ext.name === "runcomfy.Workflows");
            if (usingRunComfyHelper) {
                console.log("RunComfy-Helper handles workflow loading");
                return;
            }

            const workflow = await getWorkflow();
            if (workflow) {
                try {
                    app.graph.clear();
                    await app.loadGraphData(workflow, true, { source: 'url_params' });
                    console.log("Workflow loaded successfully");
                } catch (error) {
                    console.error("Failed to load workflow:", error);
                    if (app.ui && app.ui.dialog) {
                        app.ui.dialog.show(`Failed to load workflow: ${error.message}`);
                    }
                }
            }
        }
    }
});