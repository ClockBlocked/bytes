$(document).ready(function () {
  // Progress indicator
  function updateProgressBar() {
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const progress = (scrollTop / docHeight) * 100;
    $(".progress-indicator").css("transform", `scaleX(${progress / 100})`);
  }

  // Header scroll effect
  function handleHeaderScroll() {
    const scrolled = $(window).scrollTop() > 50;
    $(".header").toggleClass("scrolled", scrolled);
  }

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $(entry.target).addClass("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  $(".fade-in").each(function () {
    observer.observe(this);
  });

  // Smooth scrolling for navigation links
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    const target = $(this.getAttribute("href"));
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 80
        },
        800,
        "easeInOutCubic"
      );
    }
  });

  // Custom easing function
  $.easing.easeInOutCubic = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  };

  // Card hover effects with parallax
  /**        $('.card').on('mousemove', function(e) {
                const card = $(this);
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const angleX = (y - centerY) / 50;
                const angleY = (centerX - x) / 50;
                
                card.css({
                    'transform': `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(0px)`,
                    'box-shadow': `${-angleY * 2}px ${angleX * 2}px 30px rgba(1, 4, 9, 0.3)`
                });
            }).on('mouseleave', function() {
                $(this).css({
                    'transform': 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)',
                    'box-shadow': '0 20px 40px var(--shadow)'
                });
            });
**/
  // Dynamic background particles for hero section
  function createParticles() {
    const particles = [];
    const particleCount = 50;
    const container = $(".container");

    for (let i = 0; i < particleCount; i++) {
      const particle = $('<div class="particle"></div>');
      const size = Math.random() * 5 + 2;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 15 + 10;
      const opacity = Math.random() * 0.3 + 0.1;

      particle.css({
        width: `${size}px`,
        height: `${size}px`,
        left: `${posX}%`,
        top: `${posY}%`,
        "background-color": `rgba(83, 155, 245, ${opacity})`,
        "animation-delay": `${delay}s`,
        "animation-duration": `${duration}s`
      });

      container.append(particle);
      particles.push(particle);
    }

    return particles;
  }

  // Initialize particles
  createParticles();

  // Dynamic color shifting for hero title
  function animateTitleColors() {
    const colors = [
      "linear-gradient(135deg, #adbac7, #539bf5)",
      "linear-gradient(135deg, #539bf5, #b083f0)",
      "linear-gradient(135deg, #b083f0, #e0823d)",
      "linear-gradient(135deg, #e0823d, #57ab5a)",
      "linear-gradient(135deg, #57ab5a, #adbac7)"
    ];

    let currentIndex = 0;
    const title = $(".hero-title");

    setInterval(() => {
      currentIndex = (currentIndex + 1) % colors.length;
      title.css("background-image", colors[currentIndex]);
    }, 8000);
  }

  animateTitleColors();

  // Service Worker Registration
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful");
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed: ", err);
        });
    });
  }

  // Install Prompt for PWA
  let deferredPrompt;
  const installBtn = $(
    '<a href="#" class="btn btn-primary install-btn" style="position: fixed; bottom: 20px; right: 20px; z-index: 999; display: none;"><i class="fas fa-download"></i> Install App</a>'
  );
  $("body").append(installBtn);

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.fadeIn(300);

    installBtn.on("click", () => {
      installBtn.fadeOut(300);
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted install prompt");
        } else {
          console.log("User dismissed install prompt");
        }
        deferredPrompt = null;
      });
    });
  });

  // Network status detection
  function updateNetworkStatus() {
    const statusElement = $('<div class="network-status"></div>');
    $("body").append(statusElement);

    function handleNetworkChange() {
      if (navigator.onLine) {
        statusElement.text("Back online").css({
          background: "var(--accent-green)",
          color: "white"
        });
        setTimeout(() => statusElement.fadeOut(1000), 2000);
      } else {
        statusElement
          .text("No internet connection")
          .css({
            background: "var(--accent-orange)",
            color: "white"
          })
          .fadeIn();
      }
    }

    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);
    handleNetworkChange();
  }

  updateNetworkStatus();

  // Scroll to top button
  const scrollToTopBtn = $(
    '<button class="scroll-to-top"><i class="fas fa-arrow-up"></i></button>'
  );
  $("body").append(scrollToTopBtn);

  function toggleScrollToTop() {
    if ($(window).scrollTop() > 300) {
      scrollToTopBtn.fadeIn();
    } else {
      scrollToTopBtn.fadeOut();
    }
  }

  scrollToTopBtn.on("click", () => {
    $("html, body").animate({ scrollTop: 0 }, 800, "easeInOutCubic");
  });

  $(window).on("scroll", toggleScrollToTop);
  toggleScrollToTop();

  // Theme switcher (optional)
  const themeSwitcher = $(
    '<div class="theme-switcher"><i class="fas fa-moon"></i></div>'
  );
  $("body").append(themeSwitcher);

  themeSwitcher.on("click", () => {
    $("body").toggleClass("light-theme");
    themeSwitcher.find("i").toggleClass("fa-moon fa-sun");

    // Save preference to localStorage
    localStorage.setItem(
      "theme",
      $("body").hasClass("light-theme") ? "light" : "dark"
    );
  });

  // Check for saved theme preference
  if (localStorage.getItem("theme") === "light") {
    $("body").addClass("light-theme");
    themeSwitcher.find("i").removeClass("fa-moon").addClass("fa-sun");
  }

  // Initialize scroll events
  $(window)
    .on("scroll", function () {
      updateProgressBar();
      handleHeaderScroll();
    })
    .trigger("scroll");
});

// Add light theme styles if needed
const style = document.createElement("style");
style.textContent = `
            body.light-theme {
                --bg-primary: #f8f9fa;
                --bg-secondary: #ffffff;
                --bg-tertiary: #e9ecef;
                --bg-overlay: rgba(255, 255, 255, 0.95);
                --border-primary: #dee2e6;
                --border-secondary: #e9ecef;
                --text-primary: #212529;
                --text-secondary: #6c757d;
                --text-accent: #0d6efd;
                --accent-blue: #0d6efd;
                --accent-green: #198754;
                --accent-purple: #6f42c1;
                --accent-orange: #fd7e14;
                --shadow: rgba(0, 0, 0, 0.1);
            }
            
            .network-status {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                border-radius: 50px;
                font-size: 0.9rem;
                box-shadow: 0 4px 15px var(--shadow);
                display: none;
                z-index: 1000;
            }
            
            .scroll-to-top {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--accent-blue);
                color: white;
                border: none;
                cursor: pointer;
                display: none;
                z-index: 999;
                box-shadow: 0 4px 15px var(--shadow);
                transition: all 0.3s ease;
            }
            
            .scroll-to-top:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px var(--shadow);
            }
            
            .theme-switcher {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--bg-tertiary);
                color: var(--text-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 999;
                box-shadow: 0 4px 15px var(--shadow);
                transition: all 0.3s ease;
            }
            
            .theme-switcher:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px var(--shadow);
            }
            
            .particle {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                animation: float-particle linear infinite;
            }
            
            @keyframes float-particle {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100px) translateX(20px);
                    opacity: 0;
                }
            }
            
            .install-btn {
                box-shadow: 0 8px 32px var(--shadow);
                transition: all 0.3s ease;
            }
            
            .install-btn:hover {
                transform: translateY(-3px) scale(1.05);
            }
        `;
document.head.appendChild(style);