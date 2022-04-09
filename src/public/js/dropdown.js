const dropdownBtn = document.querySelector(".dropdown");
const toggleActive = function() {
    dropdownBtn.querySelector(".dropdown-content").classList.toggle("active");
};
dropdownBtn.addEventListener("click", toggleActive);