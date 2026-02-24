document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bg-music");
    const heartbeat = document.getElementById("heartbeat");
    const hero = document.querySelector(".hero");
    const storyContainer = document.getElementById("story-container");
    const sections = document.querySelectorAll(".story-section");
    const typingElement = document.getElementById("typing-text");
    const button = document.getElementById("enter-btn");
    const revealBtn = document.getElementById("reveal-btn");
    const fadeScreen = document.getElementById("fade-screen");
    const videoContainer = document.getElementById("video-container");
    const birthdayVideo = document.getElementById("birthday-video");
    const countdown = document.getElementById("countdown");
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    const text = "On this day, something rare was born...";
    let index = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    /* TYPING EFFECT */
    function typeEffect() {
        if (index < text.length) {
            typingElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeEffect, 60);
        } else {
            button.classList.remove("hidden");
        }
    }
    typeEffect();

    /* ENTER BUTTON */
    button.addEventListener("click", () => {
        hero.style.opacity = "0";
        music.volume = 0;
        music.play().catch(() => {});

        let vol = 0;
        const fadeIn = setInterval(() => {
            if (vol < 0.5) { vol += 0.02; music.volume = vol; } 
            else clearInterval(fadeIn);
        }, 200);

        setTimeout(() => {
            hero.style.display = "none";
            storyContainer.classList.remove("hidden");
            document.body.style.overflowY = "auto";
            handleScroll(); 
        }, 1000);
    });

    /* SCROLL REVEAL */
    function handleScroll() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
                section.classList.add("show");
                section.querySelectorAll(".fade-item").forEach((item, i) => {
                    setTimeout(() => item.classList.add("show-text"), i * 400);
                });
            }
        });
    }
    window.addEventListener("scroll", handleScroll);

    /* FINAL REVEAL WITH 3-2-1 COUNTDOWN */
    revealBtn.addEventListener("click", () => {
        music.pause();
        heartbeat.currentTime = 0;
        heartbeat.play().catch(() => {});

        storyContainer.classList.add("blur");
        fadeScreen.classList.remove("hidden");
        setTimeout(() => fadeScreen.classList.add("show"), 50);

        let count = 3;

        function runCountdown() {
            if (count > 0) {
                countdown.textContent = count;
                countdown.classList.remove("hidden");
                
                setTimeout(() => {
                    countdown.classList.add("show");
                }, 10);

                setTimeout(() => {
                    countdown.classList.remove("show");
                    count--;
                    setTimeout(runCountdown, 200);
                }, 800);
            } else {
                countdown.classList.add("hidden");
                heartbeat.pause();
                
                createFirework(canvas.width / 2, canvas.height / 2);
                document.body.classList.add("flash");
                setTimeout(() => document.body.classList.remove("flash"), 600);
                
                videoContainer.style.display = 'flex';
                setTimeout(() => {
                    videoContainer.classList.add("show");
                    birthdayVideo.play().catch(() => {});
                }, 100);
            }
        }
        setTimeout(runCountdown, 1000);
    });

    /* BACKGROUND HEARTS */
    let hearts = [];
    for (let i = 0; i < 30; i++) {
        hearts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 15 + 10,
            speed: Math.random() * 0.4 + 0.2
        });
    }

    function drawHeart(x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size/2, y - size/2, x - size, y + size/3, x, y + size);
        ctx.bezierCurveTo(x + size, y + size/3, x + size/2, y - size/2, x, y);
        ctx.fillStyle = "rgba(255,105,180,0.3)";
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(h => {
            drawHeart(h.x, h.y, h.size);
            h.y -= h.speed;
            if (h.y < -30) h.y = canvas.height;
        });
        requestAnimationFrame(animate);
    }
    animate();

    function createFirework(x, y) {
        const particles = [];
        for (let i = 0; i < 45; i++) {
            particles.push({
                x: x, y: y,
                radius: Math.random() * 3 + 1,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 4 + 2,
                alpha: 1
            });
        }
        function explode() {
            particles.forEach(p => {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.alpha -= 0.02;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 182, 193, ${p.alpha})`;
                ctx.fill();
            });
            if (particles.length > 0 && particles[0].alpha > 0) requestAnimationFrame(explode);
        }
        explode();
    }
});