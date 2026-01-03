let details = document.getElementById("examDetails");

document.addEventListener("DOMContentLoaded", function () {
    let exams = localStorage.getItem("exams");
    let exam = JSON.parse(exams);
    details.innerHTML = "";
    for (let i = 0; i < exam.length; i++) {
        addToTable(exam[i])
    }
});

function toggleEdit(id) {
    let startDate = document.getElementById(`startDate-${id}`);
    let startTime = document.getElementById(`startTime-${id}`);
    let endDate = document.getElementById(`endDate-${id}`);
    let endTime = document.getElementById(`endTime-${id}`);
    let duration = document.getElementById(`duration-${id}`);
    let editBtn = document.getElementById(`editBtn-${id}`);

    if (startDate.disabled) {
        startDate.removeAttribute("disabled");
        startTime.removeAttribute("disabled");
        endDate.removeAttribute("disabled");
        endTime.removeAttribute("disabled");
        duration.removeAttribute("disabled");
        editBtn.textContent = "ذخیره تغییرات";
    } else {
        let updatedExam = {
            id: id,
            startDate: `${startDate.value}T${startTime.value}:00`,
            endDate: `${endDate.value}T${endTime.value}:00`,
            duration: duration.value
        };

        fetch(`/teacher/exam/update/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(updatedExam)
        })
            .then(response => {
                if (!response.ok) throw new Error("مشکلی در ذخیره تغییرات پیش آمد!");
                return response.json();
            })
            .then(data => {
                console.log("Exam updated:", data);
                alert("تغییرات ذخیره شد!");

                startDate.setAttribute("disabled", true);
                startTime.setAttribute("disabled", true);
                endDate.setAttribute("disabled", true);
                endTime.setAttribute("disabled", true);
                duration.setAttribute("disabled", true);
                editBtn.textContent = "ویرایش";
            })
            .catch(error => console.log("خطا:", error.message));
    }
}

document.getElementById("createExamForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    let name = document.getElementById("examTitle").value
    let desc = document.getElementById("examDescription").value.trim()
    let startDate = document.getElementById("examStartDate").value
    let startTime = document.getElementById("examStartTime").value || "23:59"
    let endDate = document.getElementById("examEndDate").value
    let endTime = document.getElementById("examEndTime").value || "23:59"
    let duration = document.getElementById("examDuration").value

    let start_time = `${startDate}T${startTime}:00`
    let end_time = `${endDate}T${endTime}:00`

    let course = localStorage.getItem("course")

    let form = new FormData();
    form.append("name", name)
    form.append("description", desc)
    form.append("startDate", start_time)
    form.append("endDate", end_time)
    form.append("duration", duration)
    form.append("course" , course)

    await fetch("/teacher/exam/create", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method: "POST",
        body: form
    }).then(response => {
        if (!response.ok) {
            throw new Error("مشکلی در ساخت پیش آمده !!!")
        }
        return response.json()
    }).then(response => {
        console.log(response)
        toggleExamForm()
        let exams = JSON.parse(localStorage.getItem("exams")) || [];

        exams.push(response);

        localStorage.setItem("exams", JSON.stringify(exams));

        addToTable(response)
    }).catch(error => {
        console.log("error for create !!!" + error.message);
        alert("مشکلی در ساخت پیش آمده !!!")
    })

})

function parseLocalDateTime(event) {//2025-03-29T14:30:00
    let [date, time] = event.split("T"); // جدا کردن تاریخ و زمان
    let formattedTime = time.split(":").slice(0, 2).join(":"); // گرفتن ساعت و دقیقه

    return {date, time: formattedTime};
}

function toggleExamForm() {
    let form = document.getElementById("createExamForm");

    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

function addToTable(exam) {
    let message = document.getElementById("NoPresentMessage");

    console.log(exam)

    if (details.value === "") {
        message.style.display = "block";
    } else {
        message.style.display = "none";
    }

    let start_time = parseLocalDateTime(exam.startDate);
    let end_time = parseLocalDateTime(exam.endDate);

    details.innerHTML += `
            <tr id="examRow-${exam.id}">
                <td>${exam.name}</td>
                <td><input type="date" id="startDate-${exam.id}" class="form-control form-control-sm" value="${start_time.date}" disabled></td>
                <td><input type="time" id="startTime-${exam.id}" class="form-control form-control-sm" value="${start_time.time}" disabled></td>
                <td><input type="date" id="endDate-${exam.id}" class="form-control form-control-sm" value="${end_time.date}" disabled></td>
                <td><input type="time" id="endTime-${exam.id}" class="form-control form-control-sm" value="${end_time.time}" disabled></td>
                <td><input type="number" id="duration-${exam.id}" class="form-control form-control-sm" value="${exam.duration}" min="1" disabled></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-primary btn-sm" id="editBtn-${exam.id}" onclick="toggleEdit('${exam.id}')">ویرایش</button>
                        <button class="btn btn-info btn-sm" onclick="showExamDetails('${exam.id}')">جزئیات</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteExam('${exam.id}')">🗑️</button>
                    </div>
                </td>
            </tr>`;

}

async function deleteExam(id) {
    let isConfirmed = confirm("آیا مطمئن هستید که می‌خواهید این آزمون را حذف کنید؟");

    if (!isConfirmed) {
        return;
    }

    await fetch(`/teacher/exam?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("مشکلی در حذف پیش آمده !!!")
        }
    }).then(() => {
        let examRow = document.getElementById(`examRow-${id}`);
        if (examRow) {
            examRow.remove();
        }
    }).catch(error => {
        console.log(error.message)
        alert("مشکلی در حذف پیش آمده !!!")
    })
}

function showExamDetails(id) {
    let examRow = document.getElementById(`examRow-${id}`);
    let detailsRow = document.getElementById(`detailsRow-${id}`);

    if (detailsRow) {
        detailsRow.remove();
        return;
    }

    let exams = JSON.parse(localStorage.getItem("exams"));
    let exam = exams.find(e => e.id == id);

    if (!exam) {
        alert("آزمون یافت نشد!");
        return;
    }

    let descriptionRow = document.createElement("tr");
    descriptionRow.id = `detailsRow-${id}`;
    descriptionRow.innerHTML = `
        <td colspan="7">
            <strong>توضیحات:</strong> ${exam.description || "بدون توضیحات"}
            <br>
            <button class="btn btn-secondary btn-sm mt-2" onclick="showExamQuestions('${id}')">📋 نمایش سوالات</button>
            <button class="btn btn-success btn-sm mt-2" onclick="showStudents('${id}')">تصحیح آزمون</button>
        </td>
    `;

    examRow.insertAdjacentElement("afterend", descriptionRow);
}

async function showStudents(id) {
    localStorage.setItem("exam" , id)
    window.location.href = "/teacher/exam/students_exam"
}

async function showExamQuestions(id) {
    try {
        let response = await fetch(`/teacher/exam/question?id=${id}` , {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });
        if (!response.ok) {
            throw new Error("مشکلی در این درخواست وجود دارد!!!");
        }

        let data = await response.json();
        let json = JSON.stringify(data);
        console.log(json)
        localStorage.setItem("questions", json);
        localStorage.setItem("exam", JSON.stringify(id));

        window.location.href = "/teacher/exam/questionsPage";
    } catch (error) {
        console.log("خطا:", error.message);
    }
}
