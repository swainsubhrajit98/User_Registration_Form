function addPhoneField() {
  const phoneDiv = document.createElement("div");
  phoneDiv.innerHTML =
    '<input class="phone" type="text"><button type="button" class="btn btn-primary" onclick="this.parentNode.remove()"><i class="fa-solid fa-trash"></i></button>';
  document.getElementById("phoneNumbers").appendChild(phoneDiv);
}

function addStates() {
  const country = document.getElementById("country").value;
  const stateDropdown = document.getElementById("state");

  stateDropdown.innerHTML = '<option value="">State</option>';

  const states = new Map([
    ["India", ["Delhi", "Mumbai", "Kolkata"]],
    ["USA", ["California", "Texas", "Florida"]],
    ["Canada", ["Ontario", "Quebec", "British Columbia"]],
  ]);

  const countryStates = states.get(country);
  if (countryStates) {
    countryStates.forEach((state) => {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateDropdown.appendChild(option);
    });
  }
}

function saveUserData() {
  document.getElementById("fullNameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("addressError").textContent = "";
  document.getElementById("zipError").textContent = "";

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const dob = document.getElementById("dob").value.trim();
  const phones = Array.from(document.querySelectorAll(".phone"))
    .map((input) => input.value.trim())
    .filter((val) => val);
  const address = document.getElementById("address").value.trim();
  const zip = document.getElementById("zip").value.trim();

  if (fullName === "") {
    document.getElementById("fullNameError").textContent =
      "Full name is required";
    return;
  } else if (fullName.length < 3 || fullName.length > 64) {
    document.getElementById("fullNameError").textContent =
      "Name should be between 3 to 64 characters";
    return;
  }

  if (email === "") {
    document.getElementById("emailError").textContent = "Email is required";
    return;
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      document.getElementById("emailError").textContent =
        "Invalid email address";
      return;
    }
  }

  if (phones.length === 0) {
    document.getElementById("phoneError").textContent =
      "At least one phone number is required";
    return;
  } else {
    const phoneRegex = /^\d{10}$/;
    if (phones.some((phone) => !phoneRegex.test(phone))) {
      document.getElementById("phoneError").textContent =
        "Phone number must be exactly 10 digits";
      return;
    }
  }

  if (zip === "") {
    document.getElementById("zipError").textContent = "Zip code is required";
    return;
  } else {
    const zipRegex = /^\d{6}$/;
    if (!zipRegex.test(zip)) {
      document.getElementById("zipError").textContent =
        "Zip code must be exactly 6 digits";
      return;
    }
  }

  const tableBody = document.getElementById("userTable").querySelector("tbody");
  const newRow = `
    <tr>
      <td><input type="checkbox" class="rowCheckbox"></td>
      <td>${fullName}</td>
      <td>${email}</td>
      <td>${dob}</td>
      <td>${phones.join(", ")}</td>
      <td>${address}, ${zip}</td>
      <td>
        <button class="btn btn-warning" onclick="editUser(this)">Edit</button>
        <button class="btn btn-danger" onclick="deleteUser(this)">Delete</button>
    </tr>
  `;

  tableBody.innerHTML += newRow;
  localStorage.setItem(
    "users",
    document.querySelector("#userTable tbody").innerHTML
  );
  toastr.success("User added successfully!");
  document.getElementById("registrationForm").reset();
  const phoneNumbersContainer = document.getElementById("phoneNumbers");
  phoneNumbersContainer.innerHTML = `<div id="phoneNumbers">
                <input class="phone" type="text">
                <button type="button" class="btn btn-primary" onclick="addPhoneField()"><i class="fa-solid fa-plus"></i></button>
            </div>`;
}

function resetForm() {
  document.getElementById("registrationForm").reset();
}

window.onload = function () {
  document.querySelector("#userTable tbody").innerHTML =
    localStorage.getItem("users") || "";
};

function editUser() {
  toastr.success("User Updated successfully!");
}

function deleteUser(button) {
  button.parentElement.parentElement.remove();
  localStorage.setItem(
    "users",
    document.querySelector("#userTable tbody").innerHTML
  );
  toastr.error("User deleted successfully!");
}

function deleteSelectedUsers() {
  const selected = document.querySelectorAll("input.rowCheckbox:checked");
  if (selected.length === 0) {
    toastr.warning("No user selected.");
    return;
  }
  selected.forEach((el) => el.closest("tr").remove());
  localStorage.setItem(
    "users",
    document.getElementById("userTable").querySelector("tbody").innerHTML
  );
  toastr.error("Selected users deleted successfully!");
}

document.getElementById("sort-btn").addEventListener("change", function () {
  const sortBy = this.value;
  if (sortBy) {
    sortTable(sortBy);
  }
});

function sortTable(sortBy) {
  const table = document.getElementById("userTable");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  const columnMap = { fullName: 1, email: 2, dob: 3, phone: 4 };
  const columnIndex = columnMap[sortBy];

  const sortedRows = rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.trim().toLowerCase();
    const cellB = b.cells[columnIndex].textContent.trim().toLowerCase();

    if (sortBy === "dob") return new Date(cellA) - new Date(cellB);
    if (sortBy === "phone")
      return (
        parseInt(cellA.replace(/\D/g, ""), 10) -
        parseInt(cellB.replace(/\D/g, ""), 10)
      );
    return cellA.localeCompare(cellB);
  });

  if (tbody.getAttribute("data-sorted") === sortBy) {
    sortedRows.reverse();
    tbody.removeAttribute("data-sorted");
  } else {
    tbody.setAttribute("data-sorted", sortBy);
  }

  tbody.innerHTML = "";
  sortedRows.forEach((row) => tbody.appendChild(row));
}
