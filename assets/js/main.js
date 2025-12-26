// ---------- 1. 랜덤 그라데이션 색 ----------
    (function setRandomGradient() {
      const stored = sessionStorage.getItem("gradientColors");
      let colors;

      if (stored) {
        colors = JSON.parse(stored);
      } else {
        function randomColor() {
          const h = Math.floor(Math.random() * 360);
          const s = 70 + Math.random() * 30;
          const l = 65 + Math.random() * 20;
          return `hsl(${h}, ${s}%, ${l}%)`;
        }

        colors = {
          top: randomColor(),
          bottom: randomColor()
        };

        sessionStorage.setItem("gradientColors", JSON.stringify(colors));
      }

      document.documentElement.style.setProperty("--grad-top", colors.top);
      document.documentElement.style.setProperty("--grad-bottom", colors.bottom);
    })();

    const sections       = document.querySelectorAll("main section");
    const navButtons     = document.querySelectorAll("nav button");
    const homeButton     = document.getElementById("homeButton");
    const worksSection   = document.getElementById("works");
    const workListsLabel = document.getElementById("workListsLabel");
    const worksList      = document.getElementById("worksList");
    const worksLayout    = document.querySelector("#works .works-layout");

    function showSection(id) {
      sections.forEach(sec => {
        sec.classList.toggle("active", sec.id === id);
      });

      // 홈 섹션일 때만 슬라이드 쇼를 표시하고, 다른 섹션에선 숨기기
      const homeSlideWrapper = document.querySelector(".home-slide-wrapper");
      if (homeSlideWrapper) {
        homeSlideWrapper.style.display = id === "home" ? "block" : "none";
      }

      window.scrollTo({ top: 0, behavior: "smooth" });

      if (id === "works") {
        resetWorksToListOnly();
        alignWorkListLabel();
      }
    }

    function resetWorksToListOnly() {
      if (!worksSection) return;
      worksSection.classList.remove("detail-mode");
      worksSection.classList.add("list-only");

      if (worksList) {
        worksList.classList.remove("visible");
        worksList.style.top = "";
        worksList.style.left = "";
      }

      const workRows = document.querySelectorAll("#works .work-row");
      workRows.forEach(row => row.classList.remove("active"));

      const detailViews = document.querySelectorAll(".work-detail-view");
      detailViews.forEach(view => {
        view.style.display = "none";
      });

      const detailPlaceholder = document.querySelector(".work-detail-placeholder");
      if (detailPlaceholder) {
        detailPlaceholder.style.display = "block";
      }
    }

    function alignWorkListLabel() {
      if (!worksSection || !workListsLabel) return;
      if (!worksSection.classList.contains("active")) return;

      const logo = document.querySelector("header .logo");
      const intro = document.querySelector("#works .works-intro");
      if (!logo || !intro) return;

      const logoRect  = logo.getBoundingClientRect();
      const introRect = intro.getBoundingClientRect();

      workListsLabel.style.left = logoRect.left + "px";
      workListsLabel.style.top  = introRect.top + "px";

      const labelRect = workListsLabel.getBoundingClientRect();

      const dx = logoRect.left - labelRect.left;
      const dy = introRect.top - labelRect.top;

      workListsLabel.style.left = (logoRect.left + dx) + "px";
      workListsLabel.style.top  = (introRect.top + dy) + "px";
    }

    // ---------- 2. 상단 nav 섹션 전환 ----------
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;

        navButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        showSection(targetId);
      });
    });

    homeButton.addEventListener("click", () => {
      showSection("home");
      navButtons.forEach(b => {
        b.classList.toggle("active", b.dataset.target === "home");
      });
    });

    // ---------- 3. 언어 스위치 ----------
    // ---------- 3. 언어 스위치 ----------
    // ---------- 3. 언어 스위치 ----------
const langButtons = document.querySelectorAll(".lang-switch button");

function setLanguage(lang) {
  // <html lang="..."> 설정
  document.documentElement.lang = lang;

  // EN / KR 버튼 스타일 변경
  langButtons.forEach(b => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });

  // data-lang-block 가진 텍스트 블럭 토글
  const langBlocks = document.querySelectorAll("[data-lang-block]");
    langBlocks.forEach(el => {
      const blockLang = el.getAttribute("data-lang-block");
      el.style.display = (blockLang === lang) ? "" : "none";
    });
  }

  // 버튼 클릭 시 언어 변경
  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang; // "en" 또는 "kr"
      setLanguage(lang);
    });
  });

  // 페이지 처음 로드될 때 기본 언어 설정 (EN 기준)
  setLanguage("en");


    // ---------- 4. works: 리스트 클릭 → 상세 모드 ----------
    const workRows          = document.querySelectorAll("#works .work-row");
    const detailViews       = document.querySelectorAll(".work-detail-view");
    const detailPlaceholder = document.querySelector(".work-detail-placeholder");
    let listHideTimeout     = null;

    function showWorkDetail(id) {
      if (!worksSection) return;

      workRows.forEach(row => {
        if (row.dataset.workId === id) {
          row.classList.add("active");
        } else {
          row.classList.remove("active");
        }
      });

      let found = false;
      detailViews.forEach(view => {
        if (view.dataset.workDetail === id) {
          view.style.display = "block";
          found = true;
        } else {
          view.style.display = "none";
        }
      });

      if (detailPlaceholder) {
        detailPlaceholder.style.display = found ? "none" : "block";
      }

      if (found) {
        worksSection.classList.remove("list-only");
        worksSection.classList.add("detail-mode");
        if (worksList) {
          worksList.classList.remove("visible");
        }
      }
    }

    workRows.forEach(row => {
      const titleBtn = row.querySelector(".work-title-button");
      const id = row.dataset.workId;
      if (!id) return;

      const handleClick = () => {
        showWorkDetail(id);
      };

      row.addEventListener("click", handleClick);
      if (titleBtn) {
        titleBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          handleClick();
        });
      }
    });

    // ---------- 5. detail-mode에서 work list hover → 리스트 플로팅 ----------
    function openWorksList() {
      if (!worksSection || !worksList || !workListsLabel || !worksLayout) return;
      if (!worksSection.classList.contains("detail-mode")) return;

      clearTimeout(listHideTimeout);

      const labelRect  = workListsLabel.getBoundingClientRect();
      const layoutRect = worksLayout.getBoundingClientRect();

      const top  = labelRect.top  - layoutRect.top;
      const left = labelRect.right - layoutRect.left + 8;

      worksList.style.top  = `${top}px`;
      worksList.style.left = `${left}px`;

      worksList.classList.add("visible");
    }

    function scheduleCloseWorksList() {
      if (!worksSection || !worksList) return;
      if (!worksSection.classList.contains("detail-mode")) return;
      clearTimeout(listHideTimeout);
      listHideTimeout = setTimeout(() => {
        worksList.classList.remove("visible");
      }, 150);
    }

    if (workListsLabel) {
      workListsLabel.addEventListener("mouseenter", openWorksList);
      workListsLabel.addEventListener("mouseleave", scheduleCloseWorksList);
    }

    if (worksList) {
      worksList.addEventListener("mouseenter", openWorksList);
      worksList.addEventListener("mouseleave", scheduleCloseWorksList);
    }

    window.addEventListener("load", alignWorkListLabel);
    window.addEventListener("resize", alignWorkListLabel);

    // ---------- 6. 홈 자동 슬라이드 쇼 (폴더 이름 + count만 써서 이미지 만들기) ----------
    const homeSlideButton = document.getElementById("homeSlideButton");
    const homeSlideImage  = document.getElementById("homeSlideImage");
    const homeSlideTitle  = document.getElementById("homeSlideTitle");
    const homeSlideYear   = document.getElementById("homeSlideYear");

    // 여기서 "파일명을 하나하나 쓰는" 대신,
    // 폴더 + 확장자 + 몇 장 있는지만 적어두고,
    // JS가 1..count 를 돌면서 경로를 만들어서 씀.
    const worksConfigForHome = [
      {
        detailId: "unsecured-narratives",
        title: "Unsecured Narratives",
        year: "2025",
        folder: "./Code/contents/works/Unsecured_Narratives",
        ext: "png",
        count: 3  // 1.png ~ 2.png
      },
      {
        detailId: "optimized-humans",
        title: "How to Become Optimized Humans: Observing Them All Day Without Doing Anything",
        year: "2024",
        folder: "./Code/contents/works/How_to_be_Optimized_Human",
        ext: "JPG",
        count: 3  // 1.JPG
      },
      {
        detailId: "easiest-escape",
        title: "The Easiest Escape",
        year: "2023",
        folder: "./Code/contents/works/The_Easiest_Escape",
        ext: "png",
        count: 5  // 1.png ~ 2.png
      },
      {
        detailId: "bad-meditation",
        title: "Bad Meditation",
        year: "2022",
        folder: "./Code/contents/works/Bad_Meditation",
        ext: "png",
        count: 4  // 1.png ~ 2.png
      }
    ];

    // 위 config를 실제 이미지 배열로 확장
    const worksForHome = worksConfigForHome.map(w => {
      const images = [];
      for (let i = 1; i <= w.count; i++) {
        images.push(`${w.folder}/${i}.${w.ext}`);
      }
      return {
        detailId: w.detailId,
        title: w.title,
        year: w.year,
        images
      };
    }).filter(w => w.images.length > 0);

    let shuffledWorkOrder = [];
    let currentWorkIndex  = 0;
    let currentImageIndex = 0;

    function shuffleWorks() {
      shuffledWorkOrder = worksForHome.slice();
      for (let i = shuffledWorkOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledWorkOrder[i], shuffledWorkOrder[j]] =
          [shuffledWorkOrder[j], shuffledWorkOrder[i]];
      }
      currentWorkIndex  = 0;
      currentImageIndex = 0;
    }

    function renderHomeSlide() {
      if (!shuffledWorkOrder.length || !homeSlideImage) return;

      const work  = shuffledWorkOrder[currentWorkIndex];
      const image = work.images[currentImageIndex];

      homeSlideImage.src = image;
      homeSlideImage.alt = work.title;
      homeSlideTitle.textContent = work.title;
      homeSlideYear.textContent  = work.year;

      if (homeSlideButton) {
        homeSlideButton.dataset.workId = work.detailId;
      }
    }

    function goToNextSlide() {
      if (!shuffledWorkOrder.length) return;

      const work = shuffledWorkOrder[currentWorkIndex];

      currentImageIndex++;

      if (currentImageIndex >= work.images.length) {
        currentImageIndex = 0;
        currentWorkIndex++;

        if (currentWorkIndex >= shuffledWorkOrder.length) {
          shuffleWorks();
        }
      }

      renderHomeSlide();
    }

    // 초기화
    if (worksForHome.length > 0) {
      shuffleWorks();
      renderHomeSlide();

      const HOME_SLIDE_INTERVAL = 4000; // 4초마다 변경
      setInterval(goToNextSlide, HOME_SLIDE_INTERVAL);
    }

    // 슬라이드 클릭 → works 상세로 이동
    if (homeSlideButton) {
      homeSlideButton.addEventListener("click", () => {
        const id = homeSlideButton.dataset.workId;
        if (!id) return;

        // nav에서 works 활성화
        navButtons.forEach(b => {
          b.classList.toggle("active", b.dataset.target === "works");
        });

        // works 섹션 보여주기
        showSection("works");

        // 해당 작업 상세 열기
        showWorkDetail(id);
      });
    }
