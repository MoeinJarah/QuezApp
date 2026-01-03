let studentExam = "";
document.addEventListener("DOMContentLoaded", async function () {
    console.log("starting fetch");

    let examId = localStorage.getItem("exam");
    if (!examId) {
        alert("شناسه آزمون یافت نشد.");
        return;
    }

    try {
        const response = await fetch(`/student/exam?exam=${encodeURIComponent(examId)}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            method: "POST"
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || "خطا در دریافت اطلاعات آزمون");
        }

        initExam(responseData);
    } catch (error) {
        window.history.back()
        alert(`خطا: ${error.message}`);
        console.error(error);
    }
});


let questions = [];
let examDuration = 0;
let currentQuestionIndex = 0;
let answers = {};
let timerInterval;
let timeRemaining = 0;

const timerDisplay = document.getElementById("timer");
const questionContainer = document.getElementById("questionContainer");

function initExam(data) {
    document.getElementById("exam").innerText = data.examName
    console.log(data)
    questions = data.examQuestions;
    studentExam = data.studentExam;
    examDuration = data.duration;

    startTimer();
    renderQuestion(currentQuestionIndex);
}

function startTimer() {
    timeRemaining = examDuration * 60;
    timerInterval = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("زمان آزمون به پایان رسید. آزمون ارسال شد.");
            document.getElementById("examForm").submit();
        }
    }, 1000);
}

function renderQuestion(index) {
    const q = questions[index];
    console.log(q)
    let html = `
        <div class="card question-card mt-3">
            <div class="card-body">
                <h5 class="card-title">${q.question}</h5>
                <p class="text-muted">نمره این سوال: ${q.score}</p>
    `;

    if (q.questionType === "MULTIPLE_CHOICE") {
        html += q.options.map((opt, i) => `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="question_${q.id}" id="opt${i}" value="${opt.id}">
                <label class="form-check-label" for="opt${i}">${opt.value}</label>
            </div>
        `).join("");
    } else if (q.questionType === "SHORT_ANSWER") {
        html += `
            <div class="form-group mt-2">
                <textarea class="form-control" name="question_${q.id}" rows="4"></textarea>
            </div>
        `;
    }

    html += `</div></div>`;
    questionContainer.innerHTML = html;

    // نمایش پاسخ قبلی
    if (answers[q.id]) {
        if (q.questionType === "MULTIPLE_CHOICE") {
            const selected = document.querySelector(`input[name="question_${q.id}"][value="${answers[q.id]}"]`);
            if (selected) selected.checked = true;
        } else {
            document.querySelector(`textarea[name="question_${q.id}"]`).value = answers[q.id];
        }
    }
}

function saveAnswer() {
    const q = questions[currentQuestionIndex];
    const selected = document.querySelector(`input[name="question_${q.id}"]:checked`);
    const textAnswer = document.querySelector(`textarea[name="question_${q.id}"]`);

    if (selected) {
        answers[q.id] = selected.value;
    } else if (textAnswer) {
        answers[q.id] = textAnswer.value.trim();
    }
}

document.getElementById("nextBtn").addEventListener("click", () => {
    saveAnswer();
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    saveAnswer();
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(currentQuestionIndex);
    }
});

document.getElementById("examForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    saveAnswer();
    clearInterval(timerInterval);
    try {
        const response = await fetch("/student/answer", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                examId: localStorage.getItem("exam"),
                answers: answers,
                studentExam : studentExam
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.error || "خطا در دریافت اطلاعات آزمون");
            }
            alert("با موفقیت ارسال شد✅")
            window.location.href = "/student/page"
        })
    } catch (error) {
        alert(`خطا: ${error.message}`);
    }
});

