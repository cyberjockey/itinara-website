"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    direction?: "up" | "left" | "right" | "none";
    className?: string;
}

export function ScrollReveal({
    children,
    delay = 0,
    direction = "up",
    className = ""
}: ScrollRevealProps) {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 50 : 0,
            x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                delay: delay,
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }} // Trigger when 100px inside viewport
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
