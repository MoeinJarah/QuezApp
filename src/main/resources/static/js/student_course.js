document.addEventListener("DOMContentLoaded", async function () {
    console.log("starting fetch")
    let id = JSON.parse(localStorage.getItem("course"))
    await fetch(`/student/course?id=${encodeURIComponent(id)}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method: "GET"
    }).then(response => {
        if (!response.ok) {
            throw new Error("failed fetch for this !!!")
        }
        return response.json()
    }).then(response => {
        loadCourse(response)
    }).catch(error => {
        console.log(error.message)
    })
})

function loadCourse(course) {
    const detailsRow = document.getElementById("details");
    detailsRow.innerHTML = "";
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const courseInfoCol = document.createElement("div");
    courseInfoCol.className = "col-md-8";
    courseInfoCol.innerHTML = `
    <div class="course-info">
        <img src="data:image/jpeg;base64,${course.image}" class="img-fluid rounded mb-3" alt="${course.name}" style="max-height: 300px; object-fit: cover;" />
        <h2 class="text-primary">${course.name}</h2>
        <hr>
        <h5>مدرس: ${course.teacher || 'نامشخص'}</h5>
        <p>مدت زمان دوره: ${durationInDays} روز</p>
        <p>تعداد شرکت‌کنندگان: ${course.students?.length || 0}</p>
    </div>
    `;

    const examCol = document.createElement("div");
    examCol.className = "col-md-4";
    const examList = document.createElement("div");
    examList.className = "exam-list";

    course.exams.forEach(exam => {
        const card = document.createElement("div");
        card.className = "exam-card card shadow-sm";
        card.innerHTML = `
    <div class="card-body">
        <h5 class="card-title">${exam.name}</h5>
        <p class="card-text text-muted">${exam.description}</p>
        <p><strong>تاریخ شروع:</strong> ${exam.startDate}</p>
        <p><strong>تاریخ پایان:</strong> ${exam.endDate}</p>
        <p><strong>مدت زمان:</strong> ${exam.duration}</p>
        <p><strong>وضعیت:</strong> ${exam.state}</p>
        <p><strong>نمره شما:</strong> <span class="text-success fw-bold">${exam.score !== "-1.0" ? exam.score : "در حال بررسی"}</span></p>
        <button class="btn btn-outline-success btn-join" data-exam-id="${exam.id}">شرکت در آزمون</button>
    </div>
    `;
        examList.appendChild(card);
    });

    examCol.appendChild(examList);
    detailsRow.appendChild(courseInfoCol);
    detailsRow.appendChild(examCol);
}


document.addEventListener("click", function (event) {
    if (event.target.matches(".btn-join")) {
        let confirmDelete = confirm("شما فقط یک مرتبه میتوانید در آزمون شرکت کنبد ادامه میدهید؟");

        if (!confirmDelete) return;
        const examId = event.target.getAttribute("data-exam-id");
        joinExam(examId);
    }
});

function joinExam(id) {
    console.log(id)
    localStorage.setItem("exam", id)
    window.location.href = "/student/exam_page";
}
