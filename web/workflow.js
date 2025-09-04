async function getWorkflow(name, forceLoad = false) {
	try {
		const fetchOptions = {
			cache: forceLoad ? "no-cache" : "no-store"
		};
		if (forceLoad) {
			fetchOptions.headers = {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache'
			};
		}

		const response = await api.fetchApi(`/runcomfy/workflows?name=${name}`, fetchOptions);

		if (response.status != 200) {
			return null;
		}

		const workflowData = await response.json();
		return workflowData;
	} catch (error) {
		// Handle other errors
		console.error(error);
		return null;
	}
} 