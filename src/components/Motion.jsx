"use client";
import { motion } from "framer-motion";
// ─── Fade + rise on scroll into view ─────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
};
export function Reveal({ children, delay = 0, className, }) {
    return (<motion.div className={className} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} transition={{ delay }}>
      {children}
    </motion.div>);
}
// ─── Stagger children container ──────────────────────────────
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};
export function Stagger({ children, className, }) {
    return (<motion.div className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
      {children}
    </motion.div>);
}
export function StaggerItem({ children, className, }) {
    return (<motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>);
}
// ─── Page-level entrance ─────────────────────────────────────
export function PageTransition({ children }) {
    return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      {children}
    </motion.div>);
}
