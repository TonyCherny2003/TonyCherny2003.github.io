document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    const navLinks = document.querySelectorAll('.site-nav a[href^="#"], .brand[href^="#"], .button[href^="#"], .card-link[href^="#"]');
    const themeToggle = document.querySelector("[data-theme-toggle]");
    const form = document.getElementById("request-form");
    const status = document.getElementById("form-status");

    let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.setAttribute("data-theme", currentTheme);

    const closeMenu = () => {
        if (!nav || !menuToggle) {
            return;
        }

        nav.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            currentTheme = currentTheme === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", currentTheme);
            themeToggle.setAttribute(
                "aria-label",
                currentTheme === "dark" ? "Включить светлую тему" : "Включить темную тему"
            );
        });
    }

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

            if (!targetId || !targetId.startsWith("#") || targetId.length < 2) {
                return;
            }

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

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
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

    const validators = {
        name: (value) => value.trim().length >= 2,
        phone: (value) => value.replace(/\D/g, "").length >= 11,
        objectType: (value) => value.trim() !== "",
        comment: (value) => value.trim().length >= 10
    };

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

            if (!validators.name(nameField.value)) {
                showFieldError(nameField, "Введите имя не короче 2 символов.");
                isValid = false;
            }

            if (!validators.phone(phoneField.value)) {
                showFieldError(phoneField, "Укажите корректный номер телефона.");
                isValid = false;
            }

            if (!validators.objectType(objectTypeField.value)) {
                showFieldError(objectTypeField, "Выберите тип объекта.");
                isValid = false;
            }

            if (!validators.comment(commentField.value)) {
                showFieldError(commentField, "Добавьте комментарий не короче 10 символов.");
                isValid = false;
            }

            if (!isValid) {
                status.textContent = "Пожалуйста, исправьте ошибки в форме.";
                status.classList.add("is-error");
                return;
            }

            status.textContent = "Заявка принята в демонстрационном режиме. Для отправки на почту подключите backend или форму GitHub Pages через внешний сервис.";
            status.classList.add("is-success");
            form.reset();
        });
    }
});
