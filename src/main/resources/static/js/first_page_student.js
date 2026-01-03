document.addEventListener("DOMContentLoaded", async function () {
    console.log("starting fetch")
    await fetch("/student/details", {
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

function loadCourse(value) {
    let details = document.getElementById("details")
    details.innerHTML = ""
    for (let i = 0; i < value.length; i++) {
        details.innerHTML += `
        <div class="col">
            <div class="card h-100 shadow-sm border-0">
                <img src="data:image/jpeg;base64,${value[i].image}" class="card-img-top" alt="Java Course Image">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${value[i].name}</h5>
                </div>
                <div class="card-footer bg-white border-0 text-end">
                    <a onclick="course(${value[i].id})" class="btn btn-outline-primary btn-sm">مشاهده دوره</a>
                </div>
            </div>
        </div>
        `;
    }
}

function course(id) {
    console.log(id)
    localStorage.setItem("course" , id)
    window.location.href = "/student/page"
}
