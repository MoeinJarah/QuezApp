let exam = localStorage.getItem("exam")
document.addEventListener("DOMContentLoaded", () => {
    loadQuestions();
});

document.getElementById("toggleForm").addEventListener("click", function () {
    document.getElementById("questionFormContainer").classList.toggle("d-none");
});

document.getElementById("openSearchModal").addEventListener("click", function () {
    let searchModal = new bootstrap.Modal(document.getElementById("searchModal"));
    searchModal.show();
});

document.getElementById("type").addEventListener("change", function () {
    document.getElementById("mcqOptions").style.display = this.value === "mcq" ? "block" : "none";
});


async function filterResults() {
    let query = document.getElementById("searchInput").value;

    let response = await fetch(`/teacher/exam/search?value=${encodeURIComponent(query)}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method: "GET"
    });

    if (!response.ok) throw new Error("Failed request !!!");

    let result = await response.json();
    let resultList = document.getElementById("resultList");
    console.log(result);
    resultList.innerHTML = "";

    if (result.length > 0) {
        result.forEach(dto => {
            const item = document.createElement("li");
            item.classList.add("list-group-item", "d-flex", "flex-column", "border", "border-light", "p-3", "mb-2", "rounded");

            item.innerHTML = `
                <div class="user-select-none">
                    <h5 class="fw-bold text-primary">${dto.value}</h5>
                    <p class="mb-1"><strong>سوال :</strong><span>${dto.question}</span></p>
                    <p class="mb-1"><strong>نوع :</strong><span>${dto.questionType}</span></p>
                    <p class="mb-1"><strong>نمره :</strong><span>${dto.score}</span></p>
                </div>
            `;

            item.addEventListener("click", () => {
                selectQuestion(`${dto.id}`)
            });

            resultList.appendChild(item);
        });
    } else {
        document.getElementById("warn").classList.remove("d-none");
    }
}

async function selectQuestion(id, course) {
    console.log(course)
    console.log(JSON.stringify(course))

    await fetch(`/teacher/exam/selected?id=${encodeURIComponent(id)}&exam=${encodeURIComponent(exam)}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method: "POST"
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed Request !!!")
        }
        return response.json()
    }).then(resp => {
        console.log(resp)
        addQuestion(resp)
    }).catch(error => {
        console.log("خطا:", error.message);
    })
}

function addQuestion(question) {
    console.log(question);

    let questions = JSON.parse(localStorage.getItem("questions")) || [];

    let exists = questions.some(q => q.question === question.question);

    if (!exists) {
        questions.push(question);
        localStorage.setItem("questions", JSON.stringify(questions));
        loadQuestions();
    } else {
        alert("این سوال قبلاً اضافه شده است!");
    }
}

async function createQuestion(event, question) {
    event.preventDefault();

    let title = question.querySelector("#title").value;
    let quest = question.querySelector("#question").value.trim();
    let type = question.querySelector("#type").value;
    let score = question.querySelector("#score").value;

    let course = localStorage.getItem("course")

    let options = [];
    if (type === "mcq") {
        options = [
            document.getElementById("option1").value,
            document.getElementById("option2").value,
            document.getElementById("option3").value,
            document.getElementById("option4").value
        ].filter(option => option.trim() !== "");
    }

    let form = new FormData();
    form.append("title", title);
    form.append("question", quest);
    form.append("type", type);
    form.append("score", score);
    form.append("course", course);
    form.append("exam", exam)

    options.forEach(option => {
        form.append("options[]", option);
    });

    try {
        let response = await fetch("/teacher/exam/generate", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            method: "POST",
            body: form
        });

        if (!response.ok) {
            throw new Error("این درخواست انجام نشد!!!");
        }

        let responseData = await response.json();
        addQuestion(responseData);

    } catch (error) {
        console.log("خطا:", error.message);
    }
}

document.getElementById("type").addEventListener("change", function () {
    document.getElementById("mcqOptions").style.display = "block"
});


function loadQuestions() {
    let questionList = document.getElementById("questionList");
    questionList.innerHTML = "";

    let questions = JSON.parse(localStorage.getItem("questions")) || [];
    console.log(questions);

    for (let i = 0; i < questions.length; i++) {
        let options = '';
        if (questions[i].questionType === 'MULTIPLE_CHOICE' && questions[i].options && questions[i].options.length > 0) {
            options = questions[i].options.map((option, index) =>
                `<div>${index + 1}. ${option}</div>`
            ).join('');
        }

        let row = `<tr>
            <td>${questions[i].title}</td>
            <td>
                <input id="score-${questions[i].id}" type="number" value="${questions[i].score}" class="form-control form-control-sm" >
            </td>
            <td>${questions[i].questionType === 'MULTIPLE_CHOICE' ? 'چند گزینه‌ای' : 'تشریحی'}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="toggleDetails(${i})">نمایش</button>
                <button class="btn btn-primary btn-sm" onclick="updateScore(${questions[i].id},exam)">update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteQuestion(${questions[i].id})">حذف</button>
            </td>
        </tr>
        <tr id="details-${i}" style="display: none; background-color: darkgray;">
            <td colspan="4">
                <div><strong>متن سوال:</strong> ${questions[i].question}</div>
                <div>${options}</div>
            </td>
        </tr>`;

        questionList.innerHTML += row;
    }
}

async function updateScore(id , exam) {
    let value = document.getElementById(`score-${id}`).value
    await fetch(`/teacher/exam/update?exam=${exam}&id=${id}&value=${value}` , {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method : "PUT"
    }).then(resp => {
        if (!resp.ok) {
            throw new Error("این درخواست انجام نشد!!!");
        }
        return resp.json();
    }).then(response => {
        console.log(response)
        loadUpdate(response);
    }).catch(error => {
        console.log(error.message)
    })
}

function loadUpdate(response) {
    let questions = JSON.parse(localStorage.getItem("questions")) || [];

    let question = questions.find(q => q.question === response.question);

    if (question) {
        question.score = response.score;
    }

    localStorage.setItem("questions", JSON.stringify(questions));

    console.log(questions);
}

function toggleDetails(index) {
    let detailsRow = document.getElementById(`details-${index}`);
    if (detailsRow.style.display === "none") {
        detailsRow.style.display = "table-row";
    } else {
        detailsRow.style.display = "none";
    }
}


async function deleteQuestion(id) {
    let isConfirmed = confirm("آیا مطمئن هستید که می‌خواهید این سوال را حذف کنید؟");

    if (!isConfirmed) {
        return;
    }
    try {
        let response = await fetch(`/teacher/exam/remove?id=${id}&exam=${exam}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("failed fetch remove !!!");
        }
        removeQuestion(id);

    } catch (error) {
        console.log("Error:", error.message);
    }
}

function removeQuestion(id) {
    let questions = JSON.parse(localStorage.getItem("questions")) || [];

    questions = questions.filter(q => q.id !== id);

    localStorage.setItem("questions", JSON.stringify(questions));
    loadQuestions()
}

