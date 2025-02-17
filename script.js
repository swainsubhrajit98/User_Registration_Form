function addPhoneField() {
  const phoneDiv = document.createElement("div");
  phoneDiv.innerHTML =
    '<input class="phone" type="text"> <button type="button" class="phoneBtn" onclick="this.parentNode.remove()">-</button>';
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
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const dob = document.getElementById("dob").value;
  const phones = Array.from(document.querySelectorAll(".phone"))
    .map((input) => input.value)
    .filter((val) => val);
  const address = document.getElementById("address").value;
  const zip = document.getElementById("zip").value;

  if (fullName.length < 3 || fullName.length > 64) {
    document.getElementById("fullNameError").textContent =
      "Name should be between 3 to 64 characters";
    return;
  }
  if (!email.includes("@")) {
    document.getElementById("emailError").textContent = "Invalid email address";
    return;
  }
  if (phones.some((phone) => phone.length !== 10 || isNaN(phone))) {
    document.getElementById("phoneError").textContent =
      "Phone number must be 10 digits";
    return;
  }
  if (zip.length !== 6 || isNaN(zip)) {
    document.getElementById("zipError").textContent =
      "Zip code must be 6 digits";
    return;
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
        <button class="editBtn" onclick="editUser(this)">Edit</button>
        <button class="deleteBtn" onclick="deleteUser(this)">Delete</button></td>
    </tr>
  `;

  tableBody.innerHTML += newRow;
  localStorage.setItem(
    "users",
    document.querySelector("#userTable tbody").innerHTML
  );
  toastr.success("User added successfully!");
  document.getElementById("registrationForm").reset();
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
