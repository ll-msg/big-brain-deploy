export async function apiCall(method, url, data=null, setError, errorMsg, auth=true) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (auth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  };
    
  const body = {
    method,
    headers
  };

  if (data) {
    body.body = JSON.stringify(data);
  }
  try {
    const res = await fetch(url, body);
    if (!res.ok) {
      let errorText = await res.text();
      try {
        const error = JSON.parse(errorText);
        setError?.(error.error || errorMsg);
        //console.log(error)
      } catch {
        setError?.(errorMsg || "Unknown error");
      }
      return null;
    }
    const text = await res.text();
    const returnData = text ? JSON.parse(text) : {};
    return returnData;
  } catch (err) {
    console.error("apiCall failed:", err);
    setError?.(errorMsg || err.message);
    return null;
  }
}

export function fileToDataUrl(file) {
  const validFileTypes = [ 'image/jpeg', 'image/jpg' ]
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    return;
  }
    
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve,reject) => {
    reader.onerror = () => {
      reject("READ FAILED");
    };
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

