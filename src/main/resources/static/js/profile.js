let national_code = "";
document.addEventListener("DOMContentLoaded", function () {
    let userData = localStorage.getItem("teacher");
    if (userData) {
        userData = JSON.parse(userData);
        national_code = userData.nationalCode
        document.getElementById("name").value = userData.name || "";
        document.getElementById("lastName").value = userData.lastName || "";
        document.getElementById("nationalCode").value = userData.nationalCode || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("dob").value = userData.dob || "";
        if (userData.image) {
            document.getElementById("userImage").src = "data:image/jpeg;base64," + userData.image;
        }
    }
});

function previewImage() {
    const file = document.getElementById("imageInput").files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("userImage").src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

async function saveProfile() {
    let name = document.getElementById("name").value
    let lastName = document.getElementById("lastName").value
    let email = document.getElementById("email").value
    let dob = document.getElementById("dob").value
    let image = document.getElementById("imageInput")

    let form = new FormData();
    form.append("name", name)
    form.append("lastName", lastName)
    form.append("email", email)
    form.append("nationalCode", national_code)
    form.append("dob", dob)
    if (image && image.files.length > 0) {
        form.append("image", image.files[0]);
    }

    await fetch("/teacher/update", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method: "PUT",
        body: form
    }).then(response => {
        if (!response.ok) {
            throw new Error(`خطا در ارسال اطلاعات. کد وضعیت: ${response.status}`);
        }
        return response.json();
    }).then(response => {
        localStorage.setItem("teacher", JSON.stringify(response))
        location.reload()
    }).catch(error => {
        console.error(" خطا در ارسال:", error);
        alert("مشکلی در ارسال اطلاعات رخ داده است.");
    });

}