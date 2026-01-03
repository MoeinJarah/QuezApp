let selectedField = "";
let selectedStudents = [];
let teacherNationalCode = "";

document.addEventListener("DOMContentLoaded", function () {
    const teacher = document.getElementById("input_teacher");
    const students = document.getElementById("input_student");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const image = document.getElementById("image");
    const courseName = document.getElementById("courseName");

    let course = localStorage.getItem("course");

    if (course) {
        course = JSON.parse(course);
        console.log(course);

        courseName.value = course.name;
        image.src = "data:image/jpeg;base64," + course.image;
        teacher.value = course.teacher;
        selectedStudents = Array.isArray(course.students) ? course.students : "NO STUDENT";
        students.value = selectedStudents.length > 0 ? selectedStudents.join(", ") : "";
        teacherNationalCode = course.teacherCode;

        startDate.value = course.startDate;
        endDate.value = course.endOfTerms;
    }
});

document.getElementById("teacher").addEventListener("click", function () {
    selectedField = "teacher";
    let searchModal = new bootstrap.Modal(document.getElementById("searchModal"));
    searchModal.value = "";
    searchModal.show();
});

document.getElementById("students").addEventListener("click", function () {
    selectedField = "students";
    let searchModal = new bootstrap.Modal(document.getElementById("searchModal"));
    searchModal.value = "";
    searchModal.show();
});

function fetchResults(query) {
    fetch(`/admin/course/selected?query=${query}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method: "GET"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("خطا در دریافت اطلاعات");
            }
            return response.json();
        })
        .then(data => {
            showResults(data, selectedField === "students");
        })
        .catch(error => console.error("خطا در دریافت اطلاعات:", error));
}

function filterResults() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    fetchResults(input);
}

function showResults(items, isMultiSelect) {
    let resultList = document.getElementById("resultList");
    resultList.innerHTML = "";

    items.forEach(item => {
        let listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.style.cursor = "pointer";
        listItem.style.marginBottom = "10px";
        listItem.style.padding = "10px";
        listItem.style.border = "1px solid #ccc";
        listItem.style.borderRadius = "5px";
        listItem.innerHTML = `
            <h5>${item.fullName}</h5>
            <p>${item.nationalCode}</p>
            <p>${item.role}</p>
        `;

        listItem.onclick = function () {
            if (isMultiSelect) {
                if (!selectedStudents.includes(item.nationalCode)) {
                    selectedStudents.push(item.nationalCode);
                    listItem.style.backgroundColor = "#d1e7dd";
                } else {
                    selectedStudents = selectedStudents.filter(nc => nc !== item.nationalCode);
                    listItem.style.backgroundColor = "";
                }
                document.getElementById("input_student").value = selectedStudents.join(", ");
            } else {
                document.getElementById("input_teacher").value = item.nationalCode;
                document.querySelectorAll(".list-group-item").forEach(el => el.style.backgroundColor = "");
                listItem.style.backgroundColor = "#d1e7dd";
                closeSearch();
            }
            console.log(selectedStudents)
        };

        resultList.appendChild(listItem);
    });
}

function closeSearch() {
    let searchModal = bootstrap.Modal.getInstance(document.getElementById("searchModal"));
    if (searchModal) {
        searchModal.hide();
    }
}

document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('image').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault(); // جلوگیری از ارسال فرم پیش‌فرض

    console.log(" ارسال اطلاعات برای به‌روزرسانی دوره");

    let formData = new FormData();
    formData.append("name", document.getElementById("courseName").value);
    formData.append("teacher", document.getElementById("input_teacher").value);
    formData.append("startDate", document.getElementById("startDate").value);
    formData.append("endOfTerms", document.getElementById("endDate").value);
    formData.append("students", JSON.stringify(selectedStudents));

    if (teacherNationalCode === "NO TEACHER") {
        formData.append("teacherCode", teacherNationalCode)
        teacherNationalCode = document.getElementById("input_teacher").value
    }else if (document.getElementById("input_teacher").value.startsWith("0")){
        teacherNationalCode = document.getElementById("input_teacher").value
        formData.append("teacherCode", teacherNationalCode)
    } else {
        formData.append("teacherCode", teacherNationalCode)
    }

    let imageInput = document.getElementById("imageUpload");
    if (imageInput && imageInput.files.length > 0) {
        formData.append("image", imageInput.files[0]);
    }

    fetch("/admin/course/update", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method: "PUT",
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`خطا در ارسال اطلاعات. کد وضعیت: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert("دوره با موفقیت به‌روز شد.");
            localStorage.setItem("course", JSON.stringify(data))
            location.reload()
        })
        .catch(error => {
            console.error(" خطا در ارسال:", error);
            alert("مشکلی در ارسال اطلاعات رخ داده است.");
        });
});

document.getElementById("delete").addEventListener("click" , () => {
    let name = document.getElementById("courseName").value
    let confirmDelete = confirm(`Are you sure you want to delete "${name}" ?`);s

    if (!confirmDelete) return;

    fetch(`/admin/course/remove?name=${encodeURIComponent(name)}` , {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method : "DELETE"
    }).then((response) => {
        if (response.ok){
            alert("delete success :)")
            window.location.href = "/admin/course"
        }
    }).catch(error => {
        alert("delete failed !!!")
    })

})

function confirmSelection() {
    closeSearch();
}
