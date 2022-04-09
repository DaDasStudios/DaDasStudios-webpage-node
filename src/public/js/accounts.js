const externalAuthMethodsForm = document.querySelectorAll(
    ".externalAuthMethods"
);

externalAuthMethodsForm.forEach((crntForm) => {
    const imgChild = crntForm.querySelector("img");
    imgChild.addEventListener("click", () => {
        crntForm.submit();
    });
});