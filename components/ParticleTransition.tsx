
import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    size: number;
    brightness: number;
}

interface ParticleTransitionProps {
    onComplete: () => void;
}

const ParticleTransition: React.FC<ParticleTransitionProps> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    // Configuration
    const PARTICLE_COUNT = 400;
    const DURATION = 2500; // ms

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Initialize particles
        // Start from center (where the text usually is)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 8; // Burst speed
            const spread = Math.random() * 100; // Initial spread area

            particlesRef.current.push({
                x: centerX + (Math.random() - 0.5) * spread,
                y: centerY + (Math.random() - 0.5) * spread,
                z: 0,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                vz: Math.random() * 5, // Zoom speed
                size: Math.random() * 3 + 1,
                brightness: Math.random()
            });
        }

        // Animation Loop
        const animate = () => {
            const TimeElapsed = Date.now() - startTimeRef.current;
            const progress = Math.min(TimeElapsed / DURATION, 1);

            // Easing for "zoom away" feel - accelerate over time
            const zoomFactor = 1 + (progress * progress) * 20;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear with fading trail for "motion blur" feel
            ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + progress * 0.1})`;
            // darkening background logic: starts transparent-ish, gets darker

            // Actually, we want to clear the canvas but maybe leave trails?
            // For performance and clean look, let's clear fully but draw background
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear prev frame purely

            // Draw standard darkening background overlay
            // It starts transparent and fades to black, then fades out?
            // Request: "background subtly darkens... ambience"
            // We overlay a semi-transparent black that gets more opaque
            const bgOpacity = Math.min(progress * 1.5, 0.8);
            ctx.fillStyle = `rgba(5, 5, 10, ${bgOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and Draw Particles
            particlesRef.current.forEach(p => {
                // Move OUTWARD
                p.x += p.vx * zoomFactor * 0.5;
                p.y += p.vy * zoomFactor * 0.5;

                // Z-depth simulation
                p.z += p.vz;

                // Perspective divide
                // As Z increases (moving away), things get smaller (or bigger if we are moving INTO them?)
                // "Zoom away from camera" -> objects move away -> get smaller
                const perspective = 1000 / (1000 + p.z * 10 * zoomFactor);

                const drawSize = p.size * perspective;
                const alpha = (1 - progress) * p.brightness;

                // Draw Glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();

                // Optional: Draw streak lines for high speed feel
                if (progress > 0.2) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
                    ctx.strokeStyle = `rgba(200, 230, 255, ${alpha * 0.5})`;
                    ctx.lineWidth = drawSize / 2;
                    ctx.stroke();
                }
            });

            if (progress < 1) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [onComplete]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-[2000] pointer-events-none"
        />
    );
};

export default ParticleTransition;
