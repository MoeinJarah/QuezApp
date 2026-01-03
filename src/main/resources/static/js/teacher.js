let course_name = "";

async function profileShow() {
    try {
        let response = await fetch("/teacher/show", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            method: "GET"
        });
        if (!response.ok) throw new Error("خطا در دریافت اطلاعات پروفایل!");
        let teacherData = await response.json();
        localStorage.setItem("teacher", JSON.stringify(teacherData));
        window.location.href = "/teacher/profile";
    } catch (error) {
        console.error("خطا در دریافت اطلاعات:", error);
        alert("مشکلی در دریافت اطلاعات رخ داده است.");
    }
}

function showClassDetails(element) {
    let name = element.querySelector(".course-title").innerText
    document.getElementById("selectedClassTitle").textContent = name;
    document.getElementById("classDetails").style.display = "block";
    course_name = name;
}

async function showStudents() {
    try {
        const response = await fetch(`/teacher/students?course=${encodeURIComponent(course_name)}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("خطا در دریافت اطلاعات!");
        }

        const data = await response.json();
        localStorage.setItem("students", JSON.stringify(data));
        window.location.href = "/teacher/students/page";

    } catch (error) {
        console.error(error.message);
        alert("مشکلی در دریافت اطلاعات پیش آمده است.");
    }
}


async function showExams() {
    await fetch("/teacher/exam" , {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method:"GET"
    }).then(response => {
        if (!response.ok){
            throw new Error("خطا در دریافت اطلاعات!")
        }
        return response.json();
    }).then(response => {
        localStorage.setItem("exams" , JSON.stringify(response))
        localStorage.setItem("course" , JSON.stringify(course_name))
        window.location.href = "/teacher/exam/page"
    }).catch(error => {
        new Error(error.message);
        console.log(error.message);
    })
}
