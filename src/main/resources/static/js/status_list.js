
document.querySelectorAll(".convert").forEach(button => {
    button.addEventListener("click", (event) => {
        const button = event.target;

        let form = new FormData();
        form.append("fullName", button.getAttribute("data-fullname"));
        form.append("nationalCode", button.getAttribute("data-nationalcode"));
        form.append("status", button.getAttribute("data-status"));
        form.append("roleName", button.getAttribute("data-rolename"));

        fetch('/admin/convert', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            method: 'POST',
            body: form
        })
            .then(response => response.text())
            .then(data => {
                console.log('نتیجه سرور:', data);

                const convertButton = event.target;
                convertButton.classList.replace("btn-danger", "btn-success");
                convertButton.textContent = "تأیید شد";
                convertButton.disabled = true;

                location.reload();
            })
            .catch(error => {
                console.error('خطا:', error);
                alert('مشکلی پیش آمد، لطفاً دوباره تلاش کنید.');
            });
    });
});

