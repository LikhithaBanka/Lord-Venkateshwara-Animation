// ======================================================
// GOVINDHA SOUND
// ======================================================

const bgMusic =
    document.getElementById("bgMusic");


// Volume
bgMusic.volume = 1.0;


// ======================================================
// START SOUND
// ======================================================

function startSound() {

    bgMusic.muted = false;

    bgMusic.currentTime = 0;

    const playPromise =
        bgMusic.play();


    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                console.log(
                    "GOVINDHA SOUND PLAYING"
                );

            })
            .catch((error) => {

                console.log(
                    "Autoplay blocked. Click anywhere to start sound."
                );

            });

    }

}


// ======================================================
// TRY AUTOMATICALLY
// ======================================================

window.addEventListener(
    "load",
    function () {

        bgMusic.play()
            .catch(() => {

                console.log(
                    "Browser blocked autoplay."
                );

            });

    }
);


// ======================================================
// CLICK ANYWHERE TO START SOUND
// ======================================================

document.addEventListener(
    "click",
    function () {

        startSound();

    },
    {
        once: true
    }
);


// ======================================================
// KEYBOARD FALLBACK
// ======================================================

document.addEventListener(
    "keydown",
    function () {

        startSound();

    },
    {
        once: true
    }
);


// ======================================================
// ELEMENTS
// ======================================================

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const finalImage =
    document.getElementById("finalImage");

const flash =
    document.getElementById("flash");

const blurBackground =
    document.getElementById("blurBackground");


// ======================================================
// VARIABLES
// ======================================================

let width;
let height;

let particles = [];

let imageCanvas;
let imageCtx;

let imageWidth = 0;
let imageHeight = 0;

let revealWidth = 0;
let revealHeight = 0;

let revealLeft = 0;
let revealTop = 0;

let startTime = 0;

let imageReady = false;

let finalShown = false;


// ======================================================
// SETTINGS
// ======================================================

const SETTINGS = {

    particleCount: 9000,

    startDelay: 1000,

    formationTime: 6000,

    finalTime: 8500,

    movement: 500,

    minSize: 0.6,

    maxSize: 1.8

};


// ======================================================
// RESIZE
// ======================================================

function resize() {

    width =
        window.innerWidth;

    height =
        window.innerHeight;


    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;


    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    // SAME IMAGE SIZE

    revealWidth =
        width * 0.78;

    revealHeight =
        height * 0.72;


    revealLeft =
        (width - revealWidth) / 2;

    revealTop =
        (height - revealHeight) / 2;


    finalImage.style.width =
        revealWidth + "px";

    finalImage.style.height =
        revealHeight + "px";

    finalImage.style.left =
        revealLeft + "px";

    finalImage.style.top =
        revealTop + "px";

    finalImage.style.transform =
        "none";

}


resize();


window.addEventListener(
    "resize",
    function () {

        resize();

        if (imageReady) {

            createParticles();

        }

    }
);


// ======================================================
// LOAD IMAGE
// ======================================================

const image =
    new Image();

image.src =
    "venkateswara.jpg";


image.onload =
    function () {

        imageReady = true;

        createImageData();

        createParticles();

        startTime =
            performance.now();

        animate();

    };


image.onerror =
    function () {

        console.error(
            "Could not load venkateswara.jpg"
        );

    };


// ======================================================
// CREATE IMAGE DATA
// ======================================================

function createImageData() {

    imageCanvas =
        document.createElement(
            "canvas"
        );


    imageCtx =
        imageCanvas.getContext(
            "2d"
        );


    const maxWidth =
        180;

    const maxHeight =
        220;


    const scale =
        Math.min(
            maxWidth / image.width,
            maxHeight / image.height,
            1
        );


    imageWidth =
        Math.floor(
            image.width * scale
        );

    imageHeight =
        Math.floor(
            image.height * scale
        );


    imageCanvas.width =
        imageWidth;

    imageCanvas.height =
        imageHeight;


    imageCtx.drawImage(
        image,
        0,
        0,
        imageWidth,
        imageHeight
    );

}


// ======================================================
// CREATE PARTICLES
// ======================================================

function createParticles() {

    particles = [];


    const data =
        imageCtx.getImageData(
            0,
            0,
            imageWidth,
            imageHeight
        ).data;


    const totalPixels =
        imageWidth *
        imageHeight;


    const step =
        Math.max(
            1,
            Math.floor(
                totalPixels /
                SETTINGS.particleCount
            )
        );


    const scale =
        Math.min(
            revealWidth / imageWidth,
            revealHeight / imageHeight
        );


    const actualWidth =
        imageWidth * scale;

    const actualHeight =
        imageHeight * scale;


    const imageOffsetX =
        revealLeft +
        (
            revealWidth -
            actualWidth
        ) / 2;


    const imageOffsetY =
        revealTop +
        (
            revealHeight -
            actualHeight
        ) / 2;


    for (
        let index = 0;
        index < totalPixels;
        index += step
    ) {

        const pixel =
            index * 4;


        const r =
            data[pixel];

        const g =
            data[pixel + 1];

        const b =
            data[pixel + 2];

        const a =
            data[pixel + 3];


        if (a < 30) {

            continue;

        }


        const px =
            index %
            imageWidth;


        const py =
            Math.floor(
                index /
                imageWidth
            );


        const targetX =
            imageOffsetX +
            px * scale;


        const targetY =
            imageOffsetY +
            py * scale;


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            100 +
            Math.random() *
            SETTINGS.movement;


        const startX =
            targetX +
            Math.cos(angle) *
            distance;


        const startY =
            targetY +
            Math.sin(angle) *
            distance;


        particles.push({

            x: startX,

            y: startY,

            targetX: targetX,

            targetY: targetY,

            r: r,

            g: g,

            b: b,

            size:
                SETTINGS.minSize +
                Math.random() *
                (
                    SETTINGS.maxSize -
                    SETTINGS.minSize
                ),

            drift:
                Math.random() *
                Math.PI *
                2

        });

    }

}


// ======================================================
// EASING
// ======================================================

function easeOutCubic(t) {

    return 1 -
        Math.pow(
            1 - t,
            3
        );

}


// ======================================================
// DRAW PARTICLES
// ======================================================

function drawParticles(progress) {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const background =
        ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            Math.max(
                width,
                height
            ) * 0.7
        );


    background.addColorStop(
        0,
        "#111111"
    );


    background.addColorStop(
        1,
        "#000000"
    );


    ctx.fillStyle =
        background;


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    const eased =
        easeOutCubic(
            progress
        );


    particles.forEach(
        function (p) {

            p.x =
                p.x +
                (
                    p.targetX -
                    p.x
                ) *
                eased *
                0.055;


            p.y =
                p.y +
                (
                    p.targetY -
                    p.y
                ) *
                eased *
                0.055;


            const driftX =
                Math.sin(
                    performance.now() *
                    0.001 +
                    p.drift
                ) * 0.25;


            const driftY =
                Math.cos(
                    performance.now() *
                    0.001 +
                    p.drift
                ) * 0.25;


            const alpha =
                0.18 +
                eased * 0.82;


            ctx.beginPath();


            ctx.arc(
                p.x + driftX,
                p.y + driftY,
                p.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    ${p.r},
                    ${p.g},
                    ${p.b},
                    ${alpha}
                )`;


            ctx.fill();

        }
    );

}


// ======================================================
// ATMOSPHERE
// ======================================================

function drawAtmosphere(progress) {

    if (progress < 0.05) {

        return;

    }


    const intensity =
        Math.sin(
            progress *
            Math.PI
        );


    ctx.save();


    ctx.globalCompositeOperation =
        "screen";


    const glow =
        ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            Math.min(
                width,
                height
            ) * 0.5
        );


    glow.addColorStop(
        0,
        `rgba(
            255,
            255,
            255,
            ${0.035 * intensity}
        )`
    );


    glow.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );


    ctx.fillStyle =
        glow;


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    ctx.restore();

}


// ======================================================
// FINAL IMAGE REVEAL
// ======================================================

function revealFinalImage() {

    if (finalShown) {

        return;

    }


    finalShown = true;


    blurBackground.style.opacity =
        "1";


    flash.style.transition =
        "opacity 0.25s ease";


    flash.style.opacity =
        "0.08";


    setTimeout(
        function () {

            flash.style.opacity =
                "0";

        },
        120
    );


    // SAME SIZE - NO ZOOM

    finalImage.style.opacity =
        "1";


    finalImage.style.filter =
        "blur(14px) brightness(1.08)";


    // SLOW FINAL REVEAL

    setTimeout(
        function () {

            finalImage.style.filter =
                "blur(0px) brightness(1)";

        },
        300
    );


    canvas.style.transition =
        "opacity 1.8s ease";


    canvas.style.opacity =
        "0";

}


// ======================================================
// MAIN ANIMATION
// ======================================================

function animate() {

    if (!imageReady) {

        return;

    }


    requestAnimationFrame(
        animate
    );


    const elapsed =
        performance.now() -
        startTime;


    // BEGINNING

    if (
        elapsed <
        SETTINGS.startDelay
    ) {

        drawParticles(0);

    }


    // PARTICLE FORMATION

    else if (
        elapsed <
        SETTINGS.startDelay +
        SETTINGS.formationTime
    ) {

        const progress =
            (
                elapsed -
                SETTINGS.startDelay
            ) /
            SETTINGS.formationTime;


        drawParticles(
            Math.min(
                progress,
                1
            )
        );


        drawAtmosphere(
            progress
        );

    }


    // FINAL STAGE

    else {

        drawParticles(1);

        drawAtmosphere(1);


        if (
            elapsed >
            SETTINGS.finalTime
        ) {

            revealFinalImage();

        }

    }

}


// ======================================================
// START
// ======================================================

if (
    image.complete &&
    image.naturalWidth > 0
) {

    image.onload();

}