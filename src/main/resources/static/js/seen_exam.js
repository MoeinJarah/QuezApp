document.addEventListener("DOMContentLoaded", async function () {
    const studentData = JSON.parse(localStorage.getItem("students"));
    console.log("اطلاعات:", studentData);

    try {
        const response = await fetch("/teacher/exam/test_correction", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) throw new Error(response.error);

        const data = await response.json();
        await loadQuestion(data);

    } catch (error) {
        console.error("خطا:", error);
    }
});

async function loadQuestion(questions) {
    let form = document.getElementById("grading-form");
    questions.forEach((question, index) => {
        const card = document.createElement("div");
        card.className = "card question-card";
        card.dataset.questionId = question.id;
        card.dataset.answerId = question.answerId;

        card.innerHTML += `
        <div class="card-header bg-primary text-white">
            سوال ${index + 1}: ${question.question}
            <span class="float-end"> (از ${question.score} نمره)</span>
        </div>
        <div class="card-body">
            <h6>پاسخ دانشجو:</h6>
            <p>${question.answer}</p>

            <div class="mb-3 score-box">
                <label for="score${question.id}" class="form-label">نمره داده‌شده:</label>
                <input type="number" class="form-control score-input" id="score${question.id}"
                    step="0.25" min="0" max="${question.score}" style="width: 100px;">
                <span>/ ${question.score}</span>
            </div>
        </div>
    `;

        form.insertBefore(card, form.lastElementChild); // قبل از دکمه "ثبت نمرات" اضافه بشه
    });
}

document.getElementById("grading-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const questionCards = document.querySelectorAll(".question-card");
    const result = [];

    questionCards.forEach(card => {
        const questionId = card.getAttribute("data-question-id");
        const answerId = card.getAttribute("data-answer-id");
        const input = card.querySelector(".score-input");
        const score = parseFloat(input.value);

        if (!isNaN(score)) {
            result.push({
                examStudentID: questionId,
                score: score,
                answerId: answerId
            });
        }
    });
    console.log(result);

    fetch("/teacher/exam/submit_correction", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(result)
    }).then(response => {
        if (!response.ok) throw new Error(response.error);
        location.href = "/teacher/exam/students_exam"
    }).catch(err => {
        alert("خطایی رخ داده است: " + err.message);
    });
});
