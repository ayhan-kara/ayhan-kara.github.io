const GITHUB_USERNAME = "ayhan-kara";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`;

const GITHUB_CACHE_KEY = "githubProjectsByCategory_v2";
const GITHUB_CACHE_TIME_KEY = "githubProjectsCachedAt_v2";

let githubProjectsByCategory = {
    game: [],
    xr: [],
    web: []
};

function getProjectCategoryFromTopics(topics = []) {
    const normalizedTopics = topics.map(topic => topic.toLowerCase());

    const categories = [];

    if (
        normalizedTopics.includes("portfolio-game") ||
        normalizedTopics.includes("game") ||
        normalizedTopics.includes("unity-game")
    ) {
        categories.push("game");
    }

    if (
        normalizedTopics.includes("portfolio-xr") ||
        normalizedTopics.includes("xr") ||
        normalizedTopics.includes("vr") ||
        normalizedTopics.includes("mixed-reality")
    ) {
        categories.push("xr");
    }

    if (
        normalizedTopics.includes("portfolio-web") ||
        normalizedTopics.includes("web") ||
        normalizedTopics.includes("javascript") ||
        normalizedTopics.includes("php")
    ) {
        categories.push("web");
    }

    return categories;
}

function mapGithubRepoToProject(repo) {
    return {
        title: repo.name,
        text: repo.description || "GitHub üzerinde yayınlanmış public proje.",
        tags: [
            repo.language,
            ...(repo.topics || []).filter(topic => !topic.startsWith("portfolio-"))
        ].filter(Boolean).slice(0, 5),
        link: repo.html_url,
        updatedAt: repo.updated_at,
        stars: repo.stargazers_count,
        forks: repo.forks_count
    };
}

async function loadGithubProjects() {
    const cachedProjects = localStorage.getItem(GITHUB_CACHE_KEY);
    const cachedAt = localStorage.getItem(GITHUB_CACHE_TIME_KEY);

    const cacheDuration = 1000 * 60 * 60 * 6;
    const isCacheValid = cachedProjects && cachedAt && Date.now() - Number(cachedAt) < cacheDuration;

    if (isCacheValid) {
        githubProjectsByCategory = JSON.parse(cachedProjects);
        return;
    }

    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                "Accept": "application/vnd.github+json"
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();

        const groupedProjects = {
            game: [],
            xr: [],
            web: []
        };

        repos
            .filter(repo => !repo.fork)
            .filter(repo => repo.name !== GITHUB_USERNAME)
            .forEach(repo => {
                const categories = getProjectCategoryFromTopics(repo.topics || []);
                const project = mapGithubRepoToProject(repo);

                categories.forEach(category => {
                    groupedProjects[category].push(project);
                });
            });

        githubProjectsByCategory = groupedProjects;

        localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(groupedProjects));
        localStorage.setItem(GITHUB_CACHE_TIME_KEY, String(Date.now()));
    } catch (error) {
        console.warn("GitHub projeleri çekilemedi:", error);
    }
}

function openAboutMe() {
    document.body.classList.remove("theme-game", "theme-xr", "theme-web");
    document.body.classList.add("about-active");

    detailView.setAttribute("aria-hidden", "true");
    aboutView.setAttribute("aria-hidden", "false");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

const portfolioData = {
    game: {
        number: "01",
        label: "Unity • Game Development",
        title: "Game",
        intro: "Work on game mechanics, decision systems, quest flows, and playable prototypes.\n",
        focus: "In the game field, player decisions, quest transitions, scoring systems, scenario management, and Unity-based playable prototypes are especially prominent.\n",
        skills: [
            'Unity',
            'C#',
            'OOP',
            'Mobile Game Development',
            'Scalability',
            'Performance Optimization',
            'Version Control (Git)',
            'Collaborative Development (GitHub)',
            'AI/ML Integration'
        ],
        projects: [],
        process: [
            {
                title: "Idea",
                text: "Define playable concept and basic interaction logic."
            },
            {
                title: "Prototype",
                text: "Create quick prototype in Unity to test mechanics."
            },
            {
                title: "Logic",
                text: "Establish quest flow, decision system, flag and score structures."
            },
            {
                title: "Playtest",
                text: "Test experience to refine flow and immersion."
            }
        ],
        certificates: [
            {
                title: "Junior Programmer: Apply Object-Oriented Principles(OOP)",
                issuer: "Unity Technologies",
                date: "2022",
                credential: "Unity Learn Pathway",
                link: "https://learn.unity.com/u/602a73ccedbc2a04313ebcb8"
            },
            {
                title: "Unity Junior Programmer",
                issuer: "Unity Technologies",
                date: "2022",
                credential: "Unity Learn Pathway",
                link: "https://www.credly.com/badges/2b1f4a8f-acc8-4835-a890-3654af5360dd/public_url"
            },
            {
                title: "Unity ile Dijital Oyun Geliştirmeye Giriş",
                issuer: "BTK Akademi",
                date: "2022",
                credential: "",
                link: ""
            },
            {
                title: "Global Game Jame 2021",
                issuer: "The Global Game Jam",
                date: "2021",
                credential: "",
                link: ""
            },
            {
                title: "GFA WINTER JAM",
                issuer: "ODTÜ TEKNOKENT ATOM",
                date: "2021",
                credential: "",
                link: ""
            }
        ],
    },

    xr: {
        number: "02",
        label: "VR • XR • Interaction",
        title: "XR",
        intro: "Virtual Reality, Mixed Reality, Interaction Design, Simulation, Immersive User Experience",
        focus: "My XR work involves designing natural user interactions in virtual environments, creating VR prototypes, utilizing Meta Quest devices, implementing hand tracking, and developing physics-based experiences.",
        skills: [
            'VR',
            'MR',
            'Meta Quest',
            'Hand Tracking',
            'Unity XR',
            'Interaction Design',
            'Simulation',
            'Immersive UX',
            'AR Integration',
            'Spatial Computing',
            'AI/ML Integration'
        ],
        projects: [],
        process: [
            {
                title: "Experience",
                text: "Determining the user's immersive experience and interaction within virtual environments."
            },
            {
                title: "Interaction",
                text: "Designing hand tracking, controller, or physical interaction behaviors."
            },
            {
                title: "Prototype",
                text: "Developing the experience using Unity and XR tools to make it operational."
            },
            {
                title: "Testing",
                text: "Testing on devices to improve performance and user experience."
            }
        ],
        certificates: [
            {
                title: "XRAI Hack Clogone Certificate",
                issuer: "XR Bootcamp",
                date: "2025",
                credential: "XRAI Hack Clogone Certificate",
                link: "https://academy.xrbootcamp.com/certificates/fjyy5lefzf"
            },
            {
                title: "Unity VR Multiplayer Development",
                issuer: "Udemy",
                date: "2024",
                credential: "Unity VR Multiplayer Development (Meta XR SDK & Fusion 1)",
                link: "https://www.udemy.com/certificate/UC-cba4f2f5-a698-4fdc-a4dd-e30fc22a6bab/"
            },
            {
                title: "Mixed Reality Development Fundamentals",
                issuer: "Udemy",
                date: "2024",
                credential: "Mixed Reality Fundamentals",
                link: "https://www.udemy.com/certificate/UC-9abd3201-8e60-4506-a5c9-890727bf5818/"
            },
            {
                title: "Build Your Mixed Reality Game & Publish it on Meta's App",
                issuer: "Udemy",
                date: "2023",
                credential: "Build Your Mixed Reality Game & Publish it on Meta's App",
                link: "https://www.udemy.com/certificate/UC-79ee7af3-5301-46c4-b558-108d0a5800f8/"
            },
            {
                title: "VR Development",
                issuer: "Unity Technologies",
                date: "2022",
                credential: "VR Development Pathway",
                link: "https://www.credly.com/badges/b0c16a85-1bd7-4645-9a62-324fecf0f6b8/public_url"
            },
            {
                title: "VR Basics",
                issuer: "Unity Technologies",
                date: "2022",
                credential: "VR Basics Development",
                link: "https://learn.unity.com/u/602a73ccedbc2a04313ebcb8"
            },
        ],
    },

    web: {
        number: "03",
        label: "PHP • JavaScript • API",
        title: "Web",
        intro: "Developing digital solutions for business processes using web-based systems, management panels, and API integrations.",
        focus: "Web development using PHP, JavaScript, and SQL for order, customer, product, purchase, warehouse, API systems.",
        skills: [
            "PHP",
            "JavaScript",
            "HTML",
            "CSS",
            "MySQL",
            "MSSQL",
            "REST API",
            "Workflow Systems"
        ],
        projects: [
            {
                title: "Yurdum",
                text: "A product introduction page for the company’s products and an information page about the company.",
                tags: ["HTML", "JavaScript", "CSS"],
                link: "https://yurdum-food.de/"
            },
            {
                title: "Helal Foods",
                text: "A product introduction page for the company’s products and an information page about the company.",
                tags: ["HTML", "Javascript", "CSS"],
                link: "https://www.helal-foods.de/"
            },
            {
                title: "Messe Portal",
                text: "Contacts established and meetings held during fairs are recorded, and product promotion activities are carried out.",
                tags: ["API", "PHP", "MySQL", "Admin Panel", "CSS"],
                link: "https://www.1house.org/public/login.php"
            }
        ],
        process: [
            {
                title: "Flow",
                text: "Understanding the workflow, user roles, and data flow."
            },
            {
                title: "Structure",
                text: "Designing database schema, page structure, and backend logic."
            },
            {
                title: "Integration",
                text: "Developing API connections, form handling, and system automation."
            },
            {
                title: "Improve",
                text: "Testing, error correction, and improving user experience."
            }
        ],
        certificates: [],
    }
};

const panelButtons = document.querySelectorAll("[data-panel]");
const resetButtons = document.querySelectorAll("[data-reset]");

const detailNumber = document.getElementById("detailNumber");
const detailLabel = document.getElementById("detailLabel");
const detailTitle = document.getElementById("detailTitle");
const detailIntro = document.getElementById("detailIntro");
const detailFocus = document.getElementById("detailFocus");
const detailSkills = document.getElementById("detailSkills");
const detailProjects = document.getElementById("detailProjects");
const detailCertificates = document.getElementById("detailCertificates");
const detailProcess = document.getElementById("detailProcess");
const detailView = document.getElementById("detailView");
const aboutView = document.getElementById("aboutView");
const aboutMeButton = document.getElementById("aboutMeButton");

async function openPanel(panelName) {
    const data = portfolioData[panelName];

    if (!data) {
        return;
    }
    await loadGithubProjects();

    document.body.classList.remove("theme-game", "theme-xr", "theme-web");
    document.body.classList.add("detail-active", `theme-${panelName}`);

    detailView.setAttribute("aria-hidden", "false");

    aboutView.setAttribute("aria-hidden", "true");

    detailNumber.textContent = data.number;
    detailLabel.textContent = data.label;
    detailTitle.textContent = data.title;
    detailIntro.textContent = data.intro;
    detailFocus.textContent = data.focus;

    detailSkills.innerHTML = data.skills
        .map(skill => `<span>${skill}</span>`)
        .join("");

    const projectsToShow = githubProjectsByCategory[panelName]?.length
        ? githubProjectsByCategory[panelName]
        : data.projects;

    detailProjects.innerHTML = projectsToShow
        .map((project, index) => {
            const tags = project.tags
                .map(tag => `<span>${tag}</span>`)
                .join("");

            let linkName='';
            if(data.number === "03"){
                linkName="Website";
            }else{
                linkName="Github";
            }

            const linkButton = project.link
                ? `<a class="project-link" href="${project.link}" target="_blank" rel="noopener">${linkName} →</a>`
                : `<span class="project-link muted">In Progress</span>`;

            const meta = project.updatedAt
                ? `<small class="project-meta">Updated: ${new Date(project.updatedAt).toLocaleDateString("tr-TR")}</small>`
                : "";

            return `
            <article class="showcase-card">
                <div>
                    <span class="project-num">${String(index + 1).padStart(2, "0")}</span>
                    <h4>${project.title}</h4>
                    <p>${project.text}</p>
                    ${meta}
                </div>

                <div>
                    <div class="project-tags">${tags}</div>
                    ${linkButton}
                </div>
            </article>
        `;
        })
        .join("");

    detailProcess.innerHTML = data.process
        .map((step, index) => {
            return `
            <article class="process-step">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <h4>${step.title}</h4>
                <p>${step.text}</p>
            </article>
        `;
        })
        .join("");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    const certificatesToShow = data.certificates || [];

    detailCertificates.innerHTML = certificatesToShow.length
        ? certificatesToShow
            .map(cert => {
                const linkButton = cert.link
                    ? `<a class="cert-link" href="${cert.link}" target="_blank" rel="noopener">View Credential →</a>`
                    : "";

                return `
                <article class="certificate-card">
                    <span class="cert-date">${cert.date || ""}</span>
                    <h4>${cert.title}</h4>
                    <p>${cert.issuer || ""}</p>
                    <p>${cert.credential || ""}</p>
                    ${linkButton}
                </article>
            `;
            })
            .join("")
        : `<p class="cert-empty"></p>`;
}

function resetPage() {
    document.body.classList.remove(
        "detail-active",
        "about-active",
        "theme-game",
        "theme-xr",
        "theme-web"
    );

    detailView.setAttribute("aria-hidden", "true");
    aboutView.setAttribute("aria-hidden", "true");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

panelButtons.forEach(button => {
    button.addEventListener("click", () => {
        openPanel(button.dataset.panel);
    });
    if (aboutMeButton) {
        aboutMeButton.addEventListener("click", openAboutMe);
    }
});

resetButtons.forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();
        resetPage();
    });
});

loadGithubProjects();