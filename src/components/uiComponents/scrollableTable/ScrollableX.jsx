import React, { useRef, useState, useEffect, useCallback } from "react";

const ScrollableX = ({ children, className = "" }) => {
    const areaRef = useRef(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const EPS = 2;

    const update = useCallback(() => {
        const el = areaRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        setCanLeft(el.scrollLeft > EPS);
        setCanRight(el.scrollLeft < max - EPS);
    }, []);

    useEffect(() => {
        const el = areaRef.current;
        if (!el) return;
        update();
        el.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        let ro;
        if (window.ResizeObserver) {
            ro = new ResizeObserver(update);
            ro.observe(el);
            Array.from(el.children).forEach((c) => ro.observe(c));
        }
        return () => {
            el.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            ro?.disconnect();
        };
    }, [update, children]);

    const step = (dir) => {
        const el = areaRef.current;
        if (!el) return;
        const amount = Math.max(el.clientWidth * 0.8, 120);
        el.scrollBy({ left: dir * amount, behavior: "smooth" });
    };

    const ArrowButton = ({ direction, visible }) => (
        <button
            type="button"
            aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
            onClick={() => step(direction === "left" ? -1 : 1)}
            className={`
                absolute top-1/2 -translate-y-1/2 z-20
                ${direction === "left" ? "left-4" : "right-4"}
                w-11 h-11 rounded-full
                flex items-center justify-center
                bg-white border border-gray-200
                shadow-lg hover:shadow-xl
                text-gray-700 hover:text-gray-900
                transition-all duration-200 ease-out
                hover:scale-110 active:scale-95
                ${visible && isHovered
                    ? "opacity-100 translate-y-[-50%]"
                    : "opacity-0 pointer-events-none translate-y-[-50%] scale-90"}
            `}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {direction === "left" ? (
                    <polyline points="15 18 9 12 15 6" />
                ) : (
                    <polyline points="9 18 15 12 9 6" />
                )}
            </svg>
        </button>
    );

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* LEFT gradient shadow — the primary indicator */}
            <div
                className={`
                    absolute top-0 left-0 bottom-0 w-8 z-10 pointer-events-none
                    bg-gradient-to-r from-black/10 to-transparent
                    transition-opacity duration-300
                    ${canLeft ? "opacity-100" : "opacity-0"}
                `}
            />

            {/* RIGHT gradient shadow — the primary indicator */}
            <div
                className={`
                    absolute top-0 right-0 bottom-0 w-8 z-10 pointer-events-none
                    bg-gradient-to-l from-black/10 to-transparent
                    transition-opacity duration-300
                    ${canRight ? "opacity-100" : "opacity-0"}
                `}
            />

            {/* LEFT arrow button — appears on hover */}
            <ArrowButton direction="left" visible={canLeft} />

            {/* The actual scrollable area */}
            <div
                ref={areaRef}
                className="overflow-x-auto scroll-smooth"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(0,0,0,0.15) transparent",
                }}
            >
                {children}
            </div>

            {/* RIGHT arrow button — appears on hover */}
            <ArrowButton direction="right" visible={canRight} />
        </div>
    );
};

export default ScrollableX;