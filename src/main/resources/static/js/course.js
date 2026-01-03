document.getElementById("show-form-btn").addEventListener("click", function () {
    document.getElementById("form-container").style.display = "block";
    this.style.display = "none";
});

document.getElementById("course-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const imageInput = document.getElementById("courseImage").files[0]; // دریافت فایل

    let formData = new FormData();

    formData.append("name", name);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append("image", imageInput);


    try {
        let response = await fetch(`/admin/course`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: formData
        });

        if (!response.ok) {
            new Error("Failed to create course");
        }

        let result = await response.json();

        location.reload();

    } catch (error) {
        new Error("Error: "+ error.message);
        alert("خطا در ایجاد دوره. لطفاً دوباره تلاش کنید.");
    }
});


document.querySelectorAll(".card_select").forEach(card => {
    card.addEventListener("click", async function () {
        let name_course = card.querySelector(".card-title").innerText
        let response = await fetch(`/admin/course/edit?courseName=${encodeURIComponent(name_course)}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        if (!response.ok) throw Error("field fetch course edit !!!");
        let courseData = await response.json();
        localStorage.setItem("course", JSON.stringify(courseData));
        window.location.href = "/admin/course/view";
    });
});


document.getElementById("show-form-btn").addEventListener("click", function () {
    document.getElementById("form-container").classList.toggle("d-none");
});

