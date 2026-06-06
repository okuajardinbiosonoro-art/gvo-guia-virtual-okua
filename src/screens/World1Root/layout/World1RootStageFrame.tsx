import "./World1RootStageFrame.css";

import { forwardRef, type HTMLAttributes } from "react";

import {
  WORLD1_ROOT_COORDINATE_SYSTEM_ID,
  type World1RootLayoutStyle,
} from "./world1RootLayoutTokens";

type World1RootStageFrameProps = Omit<
  HTMLAttributes<HTMLElement>,
  "className" | "style"
> & {
  className?: string;
  style?: World1RootLayoutStyle;
};

export const World1RootStageFrame = forwardRef<
  HTMLElement,
  World1RootStageFrameProps
>(function World1RootStageFrame({ children, className, style, ...props }, ref) {
  return (
    <section
      {...props}
      ref={ref}
      className={["world1-root-stage-frame", className]
        .filter(Boolean)
        .join(" ")}
      data-world1-coordinate-system={WORLD1_ROOT_COORDINATE_SYSTEM_ID}
      style={style}
    >
      {children}
    </section>
  );
});
