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

        const response = await fetch(url, {
            method: "POST"
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
