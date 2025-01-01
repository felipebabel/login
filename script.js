async function sendData(endpoint, payload) {
    try {
        const configResponse = await fetch('config.json');
        if (!configResponse.ok) {
            throw new Error(`Erro ao carregar config.json: ${configResponse.status}`);
        }
        const configData = await configResponse.json();
        const backend_url = configData.BACKEND_URL;

        const queryParams = new URLSearchParams(payload).toString();
        const url = `${backend_url}${endpoint}?${queryParams}`;
        const token = generateToken(configData.SECRET_KEY);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
              }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log("API result:", result);
        return result;
    } catch (error) {
        console.error("Error trying to send a request to backend", error);
    }
}

 function generateToken(secretKey) {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = { user: "developer", role: "developer", iat: Math.floor(Date.now() / 1000) };
    const token = KJUR.jws.JWS.sign("HS256", JSON.stringify(header), JSON.stringify(payload), secretKey);
    return token;
  }


document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("btn").addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Button clicked!");
        const payload = {
            user: document.getElementById("user").value,
            password: document.getElementById("password").value
        };
        sendData("/api/v1/login", payload);
    });
});
