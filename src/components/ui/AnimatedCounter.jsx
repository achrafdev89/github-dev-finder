"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { formatCompact } from "@/lib/utils";
export function AnimatedCounter({ value, compact = false, className, }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const mv = useMotionValue(0);
    const spring = useSpring(mv, { damping: 30, stiffness: 90 });
    useEffect(() => {
        if (inView)
            mv.set(value);
    }, [inView, value, mv]);
    useEffect(() => {
        return spring.on("change", (latest) => {
            if (ref.current) {
                const n = Math.round(latest);
                ref.current.textContent = compact
                    ? formatCompact(n)
                    : new Intl.NumberFormat("en").format(n);
            }
        });
    }, [spring, compact]);
    return (<span ref={ref} className={className}>
      0
    </span>);
}
