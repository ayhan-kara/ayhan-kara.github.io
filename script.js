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

const portfolioData = {
    game: {
        number: "01",
        label: "Unity • Game Systems",
        title: "Game",
        intro: "Oyun mekanikleri, karar sistemleri, görev akışları ve oynanabilir prototipler üzerine çalışmalar.",
        focus: "Game alanında özellikle oyuncu kararları, görev geçişleri, puanlama sistemleri, senaryo yönetimi ve Unity tabanlı oynanabilir prototipler ön planda.",
        skills: [
            "Unity",
            "C#",
            "Game Logic",
            "Scenario Flow",
            "Decision Systems",
            "Task Management",
            "Scoring",
            "Prototype Development"
        ],
        projects: [
            {
                title: "OneDayJob Career Simulation",
                text: "Karar mekanikleri, görev akışı, puanlama sistemi ve senaryo yönetimi içeren kariyer simülasyonu.",
                tags: ["Unity", "C#", "Simulation"]
            },
            {
                title: "Decision Task System",
                text: "Oyuncunun seçtiği seçeneklere göre sonraki görevlere geçiş yapan, flag ve score değerleriyle ilerleyen sistem.",
                tags: ["Game Logic", "Runtime", "Tasks"]
            }
        ],
        process: [
            {
                title: "Idea",
                text: "Oynanabilir fikri ve temel etkileşim mantığını belirleme."
            },
            {
                title: "Prototype",
                text: "Unity içinde hızlı prototip oluşturarak mekanikleri test etme."
            },
            {
                title: "Logic",
                text: "Görev akışı, karar sistemi, flag ve score yapılarını kurma."
            },
            {
                title: "Playtest",
                text: "Deneyimi test ederek akışı ve hissiyatı iyileştirme."
            }
        ],
    },

    xr: {
        number: "02",
        label: "VR • XR • Interaction",
        title: "XR",
        intro: "Sanal gerçeklik, el takibi, fiziksel etkileşimler ve immersive simülasyon deneyimleri.",
        focus: "XR alanında sanal ortamda doğal kullanıcı etkileşimleri, VR prototipler, Meta Quest cihazları, hand tracking ve fizik tabanlı deneyimler üzerinde çalışmalar yaptım.",
        skills: [
            "VR",
            "XR",
            "Meta Quest",
            "Hand Tracking",
            "Unity XR",
            "Interaction Design",
            "Simulation",
            "Immersive UX"
        ],
        projects: [
            {
                title: "VR Dart Simulation",
                text: "Unity ve VR teknolojileri kullanılarak geliştirilen, el takibi ve fiziksel etkileşimler içeren dart simülasyonu.",
                tags: ["Unity", "VR", "Hand Tracking"]
            },
            {
                title: "VR Training Prototype",
                text: "Sürücü kursiyerleri için sanal ortamda eğitim amaçlı prototip geliştirme sürecinde görev aldığım VR proje deneyimi.",
                tags: ["VR", "Training", "Prototype"]
            }
        ],
        process: [
            {
                title: "Experience",
                text: "Kullanıcının sanal ortamda ne hissedeceğini ve nasıl etkileşime gireceğini belirleme."
            },
            {
                title: "Interaction",
                text: "El takibi, kontrolcü veya fiziksel etkileşim davranışlarını tasarlama."
            },
            {
                title: "Prototype",
                text: "Unity ve XR araçlarıyla deneyimi çalışır hale getirme."
            },
            {
                title: "Testing",
                text: "Cihaz üzerinde test ederek performans ve kullanıcı deneyimini iyileştirme."
            }
        ],
    },

    web: {
        number: "03",
        label: "PHP • JavaScript • API",
        title: "Web",
        intro: "İş süreçlerini dijitalleştiren web tabanlı sistemler, yönetim panelleri ve API entegrasyonları.",
        focus: "Web alanında PHP, JavaScript ve SQL kullanarak sipariş, müşteri, ürün, alış, depo, wareneingang ve Lexware API bağlantılı sistemler geliştiriyorum.",
        skills: [
            "PHP",
            "JavaScript",
            "HTML",
            "CSS",
            "MySQL",
            "MSSQL",
            "REST API",
            "Lexware",
            "LX Connect",
            "Workflow Systems"
        ],
        projects: [
            {
                title: "Yurdum Web Sipariş Sistemi",
                text: "Müşteri seçimi, ürün listeleme, sepet yönetimi, kullanıcı rolleri ve sipariş süreçlerini içeren web tabanlı sistem.",
                tags: ["PHP", "JavaScript", "SQL"]
            },
            {
                title: "Wareneingang & Lager Yönetimi",
                text: "Gelen ürün kontrolü, kısmi teslimat, reddedilen teslimatlar, depo hareketleri ve kayıt detaylarının yönetildiği sistem.",
                tags: ["PHP", "MSSQL", "Workflow"]
            },
            {
                title: "Lexware API Entegrasyonu",
                text: "Lexware / LX Connect üzerinden müşteri, ürün ve belge verilerinin web sistemine aktarılması ve süreç otomasyonu.",
                tags: ["API", "Lexware", "Postman"]
            }
        ],
        process: [
            {
                title: "Flow",
                text: "İş sürecini, kullanıcı rollerini ve veri akışını anlama."
            },
            {
                title: "Structure",
                text: "Database, sayfa yapısı ve backend mantığını oluşturma."
            },
            {
                title: "Integration",
                text: "API bağlantıları, form işlemleri ve sistem otomasyonlarını geliştirme."
            },
            {
                title: "Improve",
                text: "Test, hata düzeltme ve kullanıcı deneyimini iyileştirme."
            }
        ],
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
const detailProcess = document.getElementById("detailProcess");
const detailView = document.getElementById("detailView");

async function openPanel(panelName) {
    const data = portfolioData[panelName];

    await loadGithubProjects();

    if (!data) {
        return;
    }

    document.body.classList.remove("theme-game", "theme-xr", "theme-web");
    document.body.classList.add("detail-active", `theme-${panelName}`);

    detailView.setAttribute("aria-hidden", "false");

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

            const linkButton = project.link
                ? `<a class="project-link" href="${project.link}" target="_blank" rel="noopener">GitHub →</a>`
                : `<span class="project-link muted">Private / In Progress</span>`;

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
}

function resetPage() {
    document.body.classList.remove(
        "detail-active",
        "theme-game",
        "theme-xr",
        "theme-web"
    );

    detailView.setAttribute("aria-hidden", "true");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

panelButtons.forEach(button => {
    button.addEventListener("click", () => {
        openPanel(button.dataset.panel);
    });
});

resetButtons.forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();
        resetPage();
    });
});

loadGithubProjects();