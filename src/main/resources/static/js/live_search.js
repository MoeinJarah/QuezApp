const search = document.getElementById("searchInput");
const userList = document.getElementById("userList");

let role_name = null;

search.addEventListener("keyup", async function () {
    let query = this.value.trim();
    if (query.length === 0) {
        userList.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`/admin/search?query=${encodeURIComponent(query)}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            method: "GET"
        });
        if (!response.ok) throw new Error("Failed request !!!");

        const data = await response.json();
        userList.innerHTML = '';

        loadUser(data)
    } catch (error) {
        console.error("Error fetching search results:", error);
        userList.innerHTML = '<li class="list-group-item text-danger text-center">Error fetching search results</li>';
    }
});

function loadUser(data) {
    if (data && data.length > 0) {
        data.forEach(dto => {
            const userItem = document.createElement("li");
            userItem.classList.add("list-group-item", "border", "rounded", "mb-2", "p-3", "shadow-sm");
            userItem.style.cursor = "pointer";

            userItem.innerHTML = `
                        <div class="user-select-none d-flex flex-column">
                            <h5 class="fw-bold text-primary">${dto.fullName}</h5>
                            <p class="mb-1"><strong>National Code:</strong> ${dto.nationalCode}</p>
                            <p class="mb-1"><strong>Status:</strong> <span class="badge bg-info">${dto.status}</span></p>
                            <p class="mb-0"><strong>Role:</strong> <span id="role" class="badge bg-success">${dto.roleName}</span></p>
                        </div>
                    `;

            userList.appendChild(userItem);

            userItem.addEventListener("click", function (message) {
                role_name = document.getElementById("role").innerText

                fetch(`/admin/profile?nationalCode=${encodeURIComponent(dto.nationalCode)}`, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                        ,"Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Failed to fetch profile");
                        return response.json();
                    })
                    .then(profile => {
                        showProfile(profile);
                    })
                    .catch(error => {
                        console.error("Request failed:", error.message);
                        if (error.message.includes("404")) {
                            alert("موردی یافت نشد!");
                        } else if (error.message.includes("403")) {
                            alert("شما اجازه دسترسی ندارید!");
                        } else {
                            alert("خطایی رخ داده است!");
                        }
                    })
            });
        });
    } else {
        userList.innerHTML = '<li class="list-group-item text-danger text-center">No users found</li>';
    }
}

function showProfile(profile) {
    let profileContainer = document.getElementById("profileContainer");
    profileContainer.innerHTML = `
            <div class="card shadow-lg p-4">
                <h2 class="text-center mb-4">User Profile</h2>
                <div class="text-center mb-3">
                    <img src="data:image/jpeg;base64,${profile.image}" style="width 200px; height: 300px;" class="profile-image img-fluid" alt="Profile Image"/>
                </div>

                <div class="mb-3">
                    <label class="form-label">Full Name</label>
                    <p id="fullName" class="form-control">${profile.fullName}</p>
                </div>

                <div class="mb-3">
                    <label class="form-label">National Code</label>
                    <p id="nationalCode" class="form-control">${profile.nationalCode}</p>
                </div>

                <div class="mb-3">
                    <label class="form-label">State</label>
                    <p class="form-control">${profile.state}</p>
                </div>

                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <p class="form-control">${profile.email}</p>
                </div>

                <div class="text-center">
                    <button class="btn btn-primary w-25" onclick="hideProfile()">CLOSE</button>
                    <button class="btn btn-danger w-25" onclick="removeUser()">DELETE</button>
                </div>
            </div>
        `;
}

function removeUser() {
    let nationalCode = document.getElementById("nationalCode").innerText
    let fullName = document.getElementById("fullName").innerText

    console.log(role_name)

    fetch(`/admin/remove?nationalCode=${encodeURIComponent(nationalCode)}&role=${encodeURIComponent(role_name)}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        method: "DELETE"
    }).then(response => {
        if (response.ok) {
            alert(`success delete ${fullName}`)
        } else {
            alert("delete is failed !!!")
            new Error("fetch is failed !!!")
        }
        location.reload();
    })
}

function hideProfile() {
    document.getElementById("profileContainer").innerHTML = "";
}

async function invalidUser() {
    try {
        let response = await fetch("/admin/filter", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            method: "GET"
        })

        if (!response.ok) {
            throw new Error(response.error)
        }
        let data = await response.json()

        userList.innerHTML = "";
        loadUser(data)

    } catch (error) {
        alert(error.message + "خطا : ")
        console.log(error.message + "خطا : ")
    }
}
