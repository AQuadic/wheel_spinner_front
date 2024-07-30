// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const resultMessage = document.getElementById('result-message');
    const exitButton = document.getElementById('exit-button');

    const segments = ['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5', 'Prize 6'];
    const segmentColors = ['#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#33FFF6', '#A1FF33'];
    const probabilities = [0.1, 0.2, 0.3, 0.1, 0.2, 0.1]; // Probabilities must sum to 1

    // Images for each prize
    const images = [
        'path/to/prize1.png',
        'path/to/prize2.png',
        'path/to/prize3.png',
        'path/to/prize4.png',
        'path/to/prize5.png',
        'path/to/prize6.png'
    ];

    const numSegments = segments.length;
    const spinDuration = 3000;
    let isSpinning = false;
    let startTime = 0;
    let rotation = 0;
    let spinAngle = 0;

    // Load images
    const loadedImages = [];
    images.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        loadedImages[index] = img;
    });

    function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2;
        const anglePerSegment = (2 * Math.PI) / numSegments;

        for (let i = 0; i < numSegments; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, i * anglePerSegment, (i + 1) * anglePerSegment);
            ctx.fillStyle = segmentColors[i];
            ctx.fill();

            // Draw image in segment
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((i + 0.5) * anglePerSegment);
            ctx.translate(radius / 2, -radius / 2);
            ctx.drawImage(loadedImages[i], -25, -25, 50, 50);
            ctx.restore();
        }
    }

    function spinWheel() {
        if (isSpinning) return;
        isSpinning = true;
        startTime = performance.now();
        spinAngle = getSpinAngle();

        requestAnimationFrame(animate);
    }

    function animate(timestamp) {
        const elapsed = timestamp - startTime;
        if (elapsed < spinDuration) {
            rotation = (spinAngle * (elapsed / spinDuration)) % 360;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawWheel();
            ctx.restore();
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            showResult();
        }
    }

    function getSpinAngle() {
        const random = Math.random();
        let cumulativeProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (random < cumulativeProbability) {
                const segmentAngle = 360 / numSegments;
                return 360 * 3 + (i + 0.5) * segmentAngle; // Spin 3 times plus the target segment
            }
        }
    }

    function showResult() {
        const segmentAngle = 360 / numSegments;
        const resultIndex = Math.floor(((360 - rotation) % 360) / segmentAngle);
        resultMessage.textContent = `You won: ${segments[resultIndex]}!`;
        exitButton.style.display = 'inline-block';
    }

    canvas.addEventListener('click', spinWheel);
    exitButton.addEventListener('click', () => {
        resultMessage.textContent = '';
        exitButton.style.display = 'none';
    });

    drawWheel();
});
