document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup_form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        document.querySelectorAll(".error-message").forEach(e => e.innerText = "");
        document.getElementById("globalError").classList.add("d-none");

        try {
            const formData = new FormData(form);
            const response = await fetch("/start/student", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                handleValidationErrors(errorData);
            }

            window.location.assign("/start/login");

        } catch (error) {
            console.error("خطا در ارسال درخواست:", error);
            document.getElementById("globalError").innerText = error.message;
            document.getElementById("globalError").classList.remove("d-none");
        }
    });

    function handleValidationErrors(errors) {
        if (errors.globalError) {
            document.getElementById("globalError").innerText = errors.globalError;
            document.getElementById("globalError").classList.remove("d-none");
        }
        for (const field in errors) {
            if (errors.hasOwnProperty(field)) {
                const errorField = document.getElementById(`error-${field}`);
                if (errorField) {
                    errorField.innerText = errors[field];
                }
            }
        }
    }
});