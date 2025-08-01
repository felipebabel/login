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
                Authorization: token,
              }
        });

        if (!response.ok) {
          document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerText = "Invalid username or password";
        }

        const result = await response.json();
        if (result.status == 'SUCCESS') {
          document.body.classList.add("fade-out");
          setTimeout(() => {
        window.location.href = "login_screen.html";
    }, 500);
        }
        return result;
    } catch (error) {
        console.error("Error trying to send a request to backend", error);
    }
}

function generateToken(secretKey) {
    const headers = {
      'alg': 'HS256',
      'typ': 'JWT',
    };
    const payload = {
      'iss': 'developer',
      'iat': Math.floor(Date.now() / 1000),
      'sub': 'developer',
      'aud': 'login'
    };

    function base64url(source) {
        let encodedSource = CryptoJS.enc.Base64.stringify(source)
          .replace(/=+$/, '') 
          .replace(/\+/g, '-') 
          .replace(/\//g, '_');
        return encodedSource;
      }

    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(headers));
    var encodedHeader = base64url(stringifiedHeader);
   
    var stringifiedPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
    var encodedPayload = base64url(stringifiedPayload);

    var token = encodedHeader + "." + encodedPayload;

    var signature = CryptoJS.HmacSHA256(token, secretKey);
    var encodedSignature = base64url(signature);
   
    var signedToken = token + "." + encodedSignature;

    return "Bearer " + signedToken;
  }



document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("btn").addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("error-msg").innerText = "";
        document.getElementById("error-msg").style.visibility = "hidden";

        console.log("Button clicked!");
        const payload = {
            user: document.getElementById("user").value,
            password: document.getElementById("password").value
        };
        sendData("/api/v1/login", payload);
    });

    document.getElementById("btn2").addEventListener("click", (event) => {
        document.body.classList.add("fade-out");
          setTimeout(() => {
        window.location.href = "register.html";
    }, 500);
    });

    document.getElementById("btn3").addEventListener("click", (event) => {
        document.body.classList.add("fade-out");
          setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
    });

    
});
