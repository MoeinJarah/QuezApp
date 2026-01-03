document.getElementById("login_form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    const loginForm = {
        username : username,
        password : password
    }

    const response = await fetch("/start/login", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: loginForm
    });
    console.log(await response.json());
    if (response.ok) {
        const data = await response.json(); // دریافت داده‌ها به صورت asynchronous
        console.log(data); // چاپ داده‌ها برای بررسی

        const token = data.token;
        const role = data.role;
        console.log("Token: ", token);
        console.log("Role: ", role);

        // ذخیره توکن در localStorage
        localStorage.setItem("token", token);

        // ارسال توکن به سرور قبل از ریدایرکت
        const redirectUrl = role === "ROLE_ADMIN" ? "/admin" :
            role === "ROLE_TEACHER" ? "/teacher" :
                role === "ROLE_STUDENT" ? "/student" : "/start/login";

        const redirectResponse = await fetch(redirectUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` // ارسال توکن در هدر
            }
        });

        if (redirectResponse.ok) {
            console.log("Redirecting to:", redirectUrl);
            // ریدایرکت به صفحه مربوطه
            window.location.assign(redirectUrl);
        } else {
            console.error("Error in redirect request");
            alert("Redirect failed, please try again.");
        }
    } else {
        alert('Login failed: ' + response.statusText);
    }
});
