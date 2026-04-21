(function () {
    "use strict";

    // Detect touch capability and add classes for device-specific styling
    var isTouch = function () {
        return window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
               navigator.maxTouchPoints > 0 ||
               navigator.msMaxTouchPoints > 0;
    };

    if (isTouch()) {
        document.documentElement.classList.add("touch-device");
    }

    document.body.classList.add("js-ready");

    var spinner = document.getElementById("spinner");
    window.addEventListener("load", function () {
        if (spinner) {
            spinner.classList.remove("show");
        }
    });

    // Failsafe for rare reload/network cases where load event is delayed.
    window.setTimeout(function () {
        if (spinner) {
            spinner.classList.remove("show");
        }
    }, 1800);

    // Smooth navbar background blending on scroll
    var navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.classList.remove("sticky-top");
        navbar.classList.add("fixed-top");
        navbar.style.top = "0";
        navbar.style.transform = "translateY(0)";
        navbar.style.opacity = "1";
    }

    function handleSticky() {
        if (!navbar) {
            return;
        }
        navbar.style.top = "0";
        navbar.style.transform = "translateY(0)";
        navbar.style.opacity = "1";
        if (window.scrollY > 40) {
            navbar.classList.add("is-scrolled");
        } else {
            navbar.classList.remove("is-scrolled");
        }
    }
    window.addEventListener("scroll", handleSticky, { passive: true });
    handleSticky();

    function isAndroidDevice() {
        return /Android/i.test(navigator.userAgent || "");
    }

    function getEmailAddressFromLink(link) {
        var href = (link && link.getAttribute("href")) || "";

        if (!href) {
            return "";
        }

        var mailtoMatch = href.match(/^mailto:([^?]+)/i);
        if (mailtoMatch && mailtoMatch[1]) {
            return decodeURIComponent(mailtoMatch[1]);
        }

        var toMatch = href.match(/[?&]to=([^&#]+)/i);
        if (toMatch && toMatch[1]) {
            return decodeURIComponent(toMatch[1]);
        }

        return "";
    }

    function openEmailComposer(emailAddress) {
        var gmailComposeUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(emailAddress);

        if (isAndroidDevice()) {
            window.location.href = "intent://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(emailAddress) + "#Intent;scheme=https;package=com.google.android.gm;S.browser_fallback_url=" + encodeURIComponent(gmailComposeUrl) + ";end";
            return;
        }

        var tempLink = document.createElement("a");
        tempLink.href = gmailComposeUrl;
        tempLink.target = "_blank";
        tempLink.rel = "noopener noreferrer";
        document.body.appendChild(tempLink);
        tempLink.click();
        tempLink.remove();
    }

    var emailActionLinks = document.querySelectorAll(".footer-email-btn, .footer-socials a[aria-label='Email'], .founder-socials a[aria-label='Email']");
    emailActionLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            var emailAddress = getEmailAddressFromLink(link);
            if (!emailAddress) {
                return;
            }

            event.preventDefault();
            openEmailComposer(emailAddress);
        });
    });

    // Auto-mark current page in navigation
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    var navLinks = document.querySelectorAll(".navbar .nav-link");
    navLinks.forEach(function (link) {
        var href = (link.getAttribute("href") || "").toLowerCase();
        link.classList.remove("active");
        if (href === currentPage.toLowerCase()) {
            link.classList.add("active");
        }
    });

    // Keep mobile nav behavior stable by closing the menu after navigation taps
    var navbarCollapse = document.getElementById("navbarCollapse");
    if (navbarCollapse && window.bootstrap && window.bootstrap.Collapse) {
        var bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse, {
            toggle: false
        });
        var navTapTargets = document.querySelectorAll(".navbar .nav-link, .navbar .btn");
        navTapTargets.forEach(function (el) {
            el.addEventListener("click", function () {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains("show")) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // Scroll-triggered reveal animations using Intersection Observer
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });
        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add("in");
        });
    }

    // On mobile/touch screens, reveal service "Read More" when cards enter viewport
    var servicePanels = document.querySelectorAll(".service-panel");
    if (servicePanels.length) {
        var shouldUseScrollReveal = window.matchMedia("(max-width: 767.98px), (hover: none)").matches;
        if (shouldUseScrollReveal && "IntersectionObserver" in window) {
            var panelObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        panelObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.22,
                rootMargin: "0px 0px -8% 0px"
            });
            servicePanels.forEach(function (panel) {
                panelObserver.observe(panel);
            });
        } else if (shouldUseScrollReveal) {
            servicePanels.forEach(function (panel) {
                panel.classList.add("in-view");
            });
        } else {
            servicePanels.forEach(function (panel) {
                panel.classList.remove("in-view");
            });
        }
    }

    // Enhance touch/active state feedback on interactive elements
    var touchTargets = document.querySelectorAll(".btn-premium, .glass-card, .service-panel, .service-item, .footer-link");
    touchTargets.forEach(function (el) {
        if (isTouch()) {
            el.addEventListener("touchstart", function () {
                this.classList.add("touch-active");
            }, { passive: true });
            el.addEventListener("touchend", function () {
                this.classList.remove("touch-active");
            }, { passive: true });
        }
    });

    // Add focus management for keyboard navigation
    var focusableElements = document.querySelectorAll("a, button, input, select, textarea");
    focusableElements.forEach(function (el) {
        el.addEventListener("focus", function () {
            this.classList.add("has-focus");
        });
        el.addEventListener("blur", function () {
            this.classList.remove("has-focus");
        });
    });

    // Inject a mobile quick-action bar if page markup does not include it.
    var hasQuickAction = document.querySelector(".mobile-quick-action");
    if (!hasQuickAction) {
        var quickAction = document.createElement("div");
        quickAction.className = "mobile-quick-action d-md-none";
        quickAction.innerHTML = '<a class="btn-premium primary" href="contact.html">Message Us by Email</a>';
        document.body.appendChild(quickAction);
    }

    // Skeleton loading for images to improve perceived speed on mobile.
    var contentImages = document.querySelectorAll("img");
    contentImages.forEach(function (img) {
        if (!img.complete) {
            img.classList.add("is-loading");
            img.addEventListener("load", function () {
                img.classList.remove("is-loading");
            }, { once: true });
            img.addEventListener("error", function () {
                img.classList.remove("is-loading");
            }, { once: true });
        }
    });
})();
