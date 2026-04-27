// Мобильное меню, плавная прокрутка и базовая валидация формы
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
    const form = document.getElementById("request-form");
    const status = document.getElementById("form-status");

    const closeMenu = () => {
        nav.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            menuToggle.classList.toggle("is-active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            const headerOffset = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset + 1;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            closeMenu();
        });
    });

    document.addEventListener("click", (event) => {
        if (!nav || !menuToggle) {
            return;
        }

        const clickedInsideMenu = nav.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMenu();
        }
    });

    const showFieldError = (field, message) => {
        const group = field.closest(".form-group");
        const error = group ? group.querySelector(".form-error") : null;

        if (group) {
            group.classList.add("is-invalid");
        }

        if (error) {
            error.textContent = message;
        }
    };

    const clearFieldError = (field) => {
        const group = field.closest(".form-group");
        const error = group ? group.querySelector(".form-error") : null;

        if (group) {
            group.classList.remove("is-invalid");
        }

        if (error) {
            error.textContent = "";
        }
    };

    const validateName = (value) => value.trim().length >= 2;
    const validatePhone = (value) => value.replace(/\D/g, "").length >= 11;
    const validateObjectType = (value) => value.trim() !== "";
    const validateComment = (value) => value.trim().length >= 10;

    if (form && status) {
        const fields = Array.from(form.querySelectorAll("input, select, textarea"));

        fields.forEach((field) => {
            field.addEventListener("input", () => {
                clearFieldError(field);
                status.textContent = "";
                status.className = "form-status";
            });
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const nameField = form.elements.name;
            const phoneField = form.elements.phone;
            const objectTypeField = form.elements.objectType;
            const commentField = form.elements.comment;

            let isValid = true;

            [nameField, phoneField, objectTypeField, commentField].forEach(clearFieldError);
            status.textContent = "";
            status.className = "form-status";

            if (!validateName(nameField.value)) {
                showFieldError(nameField, "Введите имя не короче 2 символов.");
                isValid = false;
            }

            if (!validatePhone(phoneField.value)) {
                showFieldError(phoneField, "Укажите корректный номер телефона.");
                isValid = false;
            }

            if (!validateObjectType(objectTypeField.value)) {
                showFieldError(objectTypeField, "Выберите тип объекта.");
                isValid = false;
            }

            if (!validateComment(commentField.value)) {
                showFieldError(commentField, "Добавьте комментарий не короче 10 символов.");
                isValid = false;
            }

            if (!isValid) {
                status.textContent = "Пожалуйста, исправьте ошибки в форме.";
                status.classList.add("is-error");
                return;
            }

            status.textContent = "Заявка успешно отправлена. Это демонстрационный прототип без backend.";
            status.classList.add("is-success");
            form.reset();
        });
    }
});
