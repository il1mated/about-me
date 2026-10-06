const translations = {
    ru: {
        nav: { about: "Обо мне", projects: "Проекты", contact: "Контакты" },
        hero: {
            eyebrow: "Разработка с характером",
            title: "Привет,<br>я <span>ilimated.</span>",
            description: "Создаю на Python и для веба. Собираю идеи в работающие проекты — от первой строчки кода до последнего пикселя.",
            primaryButton: "Смотреть проекты <span class=\"button-arrow\" aria-hidden=\"true\">↘</span>",
            secondaryButton: "Написать в Telegram <span class=\"button-arrow\" aria-hidden=\"true\">↗</span>"
        },
        about: {
            kicker: "Коротко обо мне",
            title: "Обо мне",
            summary: "Любопытство к технологиям превращаю в полезные вещи. Сейчас мой фокус — Python и веб-разработка.",
            text1: "Меня зовут <strong>ilimated</strong>. Мне нравится разбираться, как устроены цифровые продукты, и делать их своими руками.",
            text2: "В коде ценю ясность, в интерфейсах — внимание к деталям. Изучаю инструменты, пробую новые подходы и складываю лучшие находки в проекты."
        },
        projects: {
            kicker: "Подборка из GitHub",
            title: "Проекты",
            loading: "Загружаю публичные репозитории…",
            empty: "Пока нет публичных проектов для показа.",
            emptyLink: "Открыть профиль на GitHub ↗",
            error: "Не удалось загрузить список автоматически.",
            descriptionFallback: "Исходный код и подробности проекта на GitHub."
        },
        contact: {
            label: "На связи",
            message: "Давайте сделаем что-нибудь классное."
        },
        footer: {
            note: "© 2026 ilimated · Сделано с вниманием к деталям"
        }
        },
        en: {
        nav: { about: "About me", projects: "Projects", contact: "Contact" },
        hero: {
            eyebrow: "Development with character",
            title: "Hi,<br>I am <span>ilimated.</span>",
            description: "Building with Python and web technologies. Turning ideas into working products — from the first line of code to the final pixel.",
            primaryButton: "View projects <span class=\"button-arrow\" aria-hidden=\"true\">↘</span>",
            secondaryButton: "Message on Telegram <span class=\"button-arrow\" aria-hidden=\"true\">↗</span>"
        },
        about: {
            kicker: "A quick intro",
            title: "About me",
            summary: "I turn curiosity about technology into useful products. Right now my focus is Python and web development.",
            text1: "My name is <strong>ilimated</strong>. I enjoy understanding how digital products work and building them by hand.",
            text2: "I value clarity in code and attention to detail in interfaces. I explore tools, test new approaches, and turn useful ideas into projects."
        },
        projects: {
            kicker: "Selected from GitHub",
            title: "Projects",
            loading: "Loading public repositories…",
            empty: "There are no public projects to show yet.",
            emptyLink: "Open GitHub profile ↗",
            error: "Could not load the project list automatically.",
            descriptionFallback: "Source code and project details are available on GitHub."
        },
        contact: {
            label: "Get in touch",
            message: "Let’s build something great together."
        },
        footer: {
            note: "© 2026 ilimated · Built with attention to detail"
        }
    }
};

const state = { language: "ru" };
const projectGrid = document.querySelector("#project-grid");
const githubProfile = "https://github.com/il1mated";
const avatar = document.querySelector("#profile-avatar");
const avatarPlaceholder = document.querySelector("#avatar-placeholder");
const langSwitch = document.querySelector(".lang-switch");
const languageButtons = [...document.querySelectorAll(".lang-btn")];

function updateLanguageSlider(language) {
    const baseButton = languageButtons[0];
    const activeButton = languageButtons.find((button) => button.dataset.lang === language);
    langSwitch.style.setProperty("--lang-offset", `${activeButton.offsetLeft - baseButton.offsetLeft}px`);
}

function selectLanguageAt(clientX) {
    const bounds = langSwitch.getBoundingClientRect();
    setLanguage(clientX < bounds.left + bounds.width / 2 ? "ru" : "en");
}

if (avatar) {
    avatar.addEventListener("error", () => {
        avatar.remove();
        avatarPlaceholder.style.display = "grid";
    });
}

function setLanguage(language) {
    if (!translations[language] || language === state.language) return;

    state.language = language;
    document.body.dataset.language = language;
    document.documentElement.lang = language;
    updateLanguageSlider(language);

    function updateText(element, value) {
        element.innerHTML = value;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        element.animate(
            [{ opacity: 0.35 }, { opacity: 1 }],
            { duration: 260, easing: "cubic-bezier(.2,.75,.25,1)" }
        );
    }

    document.querySelectorAll(".lang-btn").forEach((button) => {
        const isActive = button.dataset.lang === language;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    Object.entries(translations[language].nav).forEach(([key, value]) => {
        const link = document.querySelector(`[data-nav="${key}"]`);
        if (link) updateText(link, value);
    });

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const path = element.dataset.i18n.split(".");
        let value = translations[language];
        for (const part of path) {
            value = value?.[part];
        }
        if (typeof value === "string") updateText(element, value);
    });

    const currentProjectFallback = projectGrid.querySelector(".projects-state");
    if (currentProjectFallback && currentProjectFallback.dataset.langFallback) {
        updateText(currentProjectFallback, `${translations[language].projects.empty} <a href="${githubProfile}" target="_blank" rel="noopener noreferrer">${translations[language].projects.emptyLink}</a>`);
    }
}

function showProjectFallback(messageKey) {
    const languageText = translations[state.language].projects;
    const linkText = languageText.emptyLink;
    projectGrid.innerHTML = `<div class="projects-state" data-lang-fallback="true">${languageText[messageKey]} <a href="${githubProfile}" target="_blank" rel="noopener noreferrer">${linkText}</a></div>`;
}

function renderProjects(repositories) {
    const projects = repositories
    .filter((repository) => !repository.fork)
    .sort((first, second) => new Date(second.pushed_at) - new Date(first.pushed_at))
    .slice(0, 3);

    if (!projects.length) {
        showProjectFallback("empty");
        return;
    }

    projectGrid.replaceChildren(...projects.map((repository) => {
        const card = document.createElement("a");
        card.className = "project-card";
        card.href = repository.html_url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";

        const top = document.createElement("div");
        top.className = "project-top";
        const language = document.createElement("span");
        language.className = "project-language";
        language.textContent = repository.language || "Open source";
        const arrow = document.createElement("span");
        arrow.className = "project-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        top.append(language, arrow);

        const title = document.createElement("h3");
        title.textContent = repository.name;
        const description = document.createElement("p");
        description.textContent = repository.description || translations[state.language].projects.descriptionFallback;
        card.append(top, title, description);
        return card;
    }));
}

document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => {
        setLanguage(button.dataset.lang);
    });
});

let activeLanguagePointer = null;

langSwitch.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    activeLanguagePointer = event.pointerId;
    langSwitch.setPointerCapture(event.pointerId);
    langSwitch.dataset.dragging = "true";
    selectLanguageAt(event.clientX);
});

langSwitch.addEventListener("pointermove", (event) => {
    if (event.pointerId === activeLanguagePointer) selectLanguageAt(event.clientX);
});

function finishLanguageDrag(event) {
    if (event.pointerId !== activeLanguagePointer) return;
    activeLanguagePointer = null;
    delete langSwitch.dataset.dragging;
}

langSwitch.addEventListener("pointerup", finishLanguageDrag);
langSwitch.addEventListener("pointercancel", finishLanguageDrag);

setLanguage("ru");

fetch("https://api.github.com/users/il1mated/repos?sort=updated&per_page=30", {
    headers: { Accept: "application/vnd.github+json" }
})
.then((response) => {
    if (!response.ok) throw new Error("GitHub API unavailable");
    return response.json();
    })
.then(renderProjects)
.catch(() => showProjectFallback("error"));