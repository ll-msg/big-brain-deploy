export async function apiCall(method, url, data=null, setError, errorMsg) {
    const token = localStorage.getItem('token');
    const body = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined,
        },
    };
    if (data) {
        body.body = JSON.stringify(data);
    }
    const res = await fetch(url, body);
    
    if (!res.ok) {
        const error = await res.json();
        setError(error.error || errorMsg);
        return;
    }
    const returnData = await res.json();
    console.log(returnData)
    return returnData;
}