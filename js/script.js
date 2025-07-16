document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav ul');

    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        navToggle.classList.toggle('open'); // For hamburger animation
    });

    // Close nav when a link is clicked (for single-page navigation AND multi-page navigation)
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if the link is an internal section link on the current page
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile nav if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    navToggle.classList.remove('open');
                }
            } else if (href.includes('#') && !href.startsWith('#')) {
                // This handles links like "index.html#section" from the transparency page
                // Allow default navigation to the main page, then scroll (handled by main page JS)
                // Or you could build a more complex logic to prevent default and handle it here,
                // but for simplicity, letting the browser navigate and then main page JS take over is often fine.
                // For a smooth experience, the target section needs to be loaded when the index.html loads.
            } else {
                 // For regular page links (e.g., to transparency.html, or just index.html)
                 // Allow default browser behaviour
            }
        });
    });

    // 2. Smooth Scrolling for Navigation Links (specifically for current page anchors)
    // This part is for anchors on the *current* page.
    // The logic for navigating from transparency.html to index.html#section is handled by the browser loading index.html
    // and then its own DOMContentLoaded event handling the scroll if the URL has a hash.

    // 3. Counter Animation on Scroll
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the speed, the faster the count

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let current = 0;

        const updateCount = () => {
            const increment = target / speed;
            if (current < target) {
                current += increment;
                counter.innerText = Math.ceil(current);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                if (!counter.dataset.animated) { // Check if already animated
                    animateCounter(counter);
                    counter.dataset.animated = 'true'; // Mark as animated
                }
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the element is visible
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 4. Simple Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial-slide');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = (i === index) ? 'block' : 'none';
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    if (testimonials.length > 1) { // Only start slider if there's more than one testimonial
        showTestimonial(currentTestimonial); // Show the first one initially
        setInterval(nextTestimonial, 7000); // Change testimonial every 7 seconds
    }
});