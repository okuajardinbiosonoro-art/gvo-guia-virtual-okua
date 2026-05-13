import { motion } from "motion/react";
import type { ReactNode } from "react";

interface MobileShellProps {
  eyebrow: string;
  title?: string;
  children: ReactNode;
}

export function MobileShell({
  eyebrow,
  title = "GVO — Guía Virtual OKÚA",
  children,
}: MobileShellProps) {
  return (
    <motion.main
      className="mobile-shell"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <section className="base-panel" aria-labelledby="gvo-title">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="gvo-title">{title}</h1>
        <p className="status-pill">Sin audio · Sin Internet · Mobile-first</p>
        {children}
      </section>
    </motion.main>
  );
}
