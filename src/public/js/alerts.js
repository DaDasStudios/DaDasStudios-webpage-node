const alerts = [...document.getElementsByClassName("alert")];
window.onload = () => {
    alerts.forEach((e) => {
        e.classList.add("alert-inactive");
    });
};