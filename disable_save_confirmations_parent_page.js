// Alternative solution: Disable save confirmations from parent page
// Add this to your parent page that contains the ComfyUI iframe

function disableComfyUISaveConfirmations(iframeId = 'comfyui-runcomfy') {
    const iframe = document.getElementById(iframeId);
    
    if (!iframe) {
        console.error(`Iframe with id '${iframeId}' not found`);
        return;
    }
    
    // Wait for iframe to load
    iframe.addEventListener('load', function() {
        try {
            const iframeWindow = iframe.contentWindow;
            const iframeDocument = iframe.contentDocument;
            
            if (!iframeWindow || !iframeDocument) {
                console.warn('Cannot access iframe content - may be blocked by CORS');
                return;
            }
            
            // Override beforeunload in the iframe
            iframeWindow.addEventListener('beforeunload', function(e) {
                e.preventDefault();
                delete e['returnValue'];
                return;
            }, true);
            
            // Override onbeforeunload property
            Object.defineProperty(iframeWindow, 'onbeforeunload', {
                set: function(func) {
                    console.log('[Parent] Blocked ComfyUI onbeforeunload handler');
                },
                get: function() {
                    return null;
                }
            });
            
            // Disable form change tracking
            const forms = iframeDocument.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    form.reset();
                });
            });
            
            const inputs = iframeDocument.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('change', function() {
                    this.defaultValue = this.value;
                });
            });
            
            // Monitor for dynamically added elements
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.querySelectorAll) {
                            const newInputs = node.querySelectorAll('input, textarea, select');
                            newInputs.forEach(input => {
                                input.addEventListener('change', function() {
                                    this.defaultValue = this.value;
                                });
                            });
                        }
                    });
                });
            });
            
            observer.observe(iframeDocument.body, {
                childList: true,
                subtree: true
            });
            
            console.log('[Parent] Successfully disabled save confirmations in ComfyUI iframe');
            
        } catch (error) {
            console.warn('Cannot disable save confirmations in iframe:', error.message);
            console.warn('This is likely due to CORS restrictions. Use the RunComfy-Helper solution instead.');
        }
    });
}

// Usage: Call this function after your iframe is created
// disableComfyUISaveConfirmations('your-iframe-id'); 