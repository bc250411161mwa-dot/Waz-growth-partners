(function () {
    "use strict";

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

    var navbar = document.querySelector(".navbar");
    function handleSticky() {
        if (!navbar) {
            return;
        }
        if (window.scrollY > 40) {
            navbar.classList.add("sticky-top");
        } else {
            navbar.classList.remove("sticky-top");
        }
    }
    window.addEventListener("scroll", handleSticky);
    handleSticky();

    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    var navLinks = document.querySelectorAll(".navbar .nav-link");
    navLinks.forEach(function (link) {
        var href = (link.getAttribute("href") || "").toLowerCase();
        link.classList.remove("active");
        if (href === currentPage.toLowerCase()) {
            link.classList.add("active");
        }
    });

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
})();
