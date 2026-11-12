import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { setJourneyRuntimeContext, type ValidatedJourneyContext } from "./journeyEssential";

const ActivityContext = createContext<{ active: boolean; attemptId: string | null }>({ active: false, attemptId: null });
export function JourneyActivationProvider({ context, children, canActivate, onActivationRejected }: { context: ValidatedJourneyContext; children: ReactNode; canActivate?: () => boolean; onActivationRejected?: () => void }) {
  const identity = `${context.attemptId}:${context.screen}:${context.mode}:${context.authorized}`;
  const [published, setPublished] = useState({ identity: "", active: false });
  useLayoutEffect(() => {
    const active = context.active && (!canActivate || canActivate());
    setJourneyRuntimeContext({ ...context, active });
    setPublished((current) => current.identity === identity && current.active === active ? current : { identity, active });
    if (context.active && !active) onActivationRejected?.();
    return () => setJourneyRuntimeContext({ ...context, active: false });
  }, [context, identity, canActivate, onActivationRejected]);
  // Child layout effects first observe inactive. Publication happens only after
  // the activation boundary has checked the actual clock/token in this commit.
  return <ActivityContext.Provider value={{ active: context.active && published.identity === identity && published.active, attemptId: context.attemptId }}>{children}</ActivityContext.Provider>;
}
export function useJourneyActivity() { return useContext(ActivityContext); }

/** Local inactive scope; deliberately never publishes a global runtime context. */
export function JourneyActivityScope({ active, children }: { active: boolean; children: ReactNode }) {
  const parent = useContext(ActivityContext);
  return <ActivityContext.Provider value={{ ...parent, active: parent.active && active }}>{children}</ActivityContext.Provider>;
}
