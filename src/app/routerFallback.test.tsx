import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { journeyRouteModuleLoaders } from "./routeModules";
import { router } from "./router";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

it("uses stored EN in the actual route Suspense fallback while its module is pending, then removes it after resolve", async () => {
  localStorage.setItem("gvo.language.v1", "en");
  type Module = Awaited<ReturnType<typeof journeyRouteModuleLoaders.world1>>;
  let finish!: (module: Module) => void;
  const pending = new Promise<Module>((resolve) => {
    finish = resolve;
  });
  const loader = vi
    .spyOn(journeyRouteModuleLoaders, "world1")
    .mockReturnValue(pending);
  const route = router.routes[0].children?.find(
    (candidate) => candidate.path === "/estacion/1",
  );
  expect(route?.element).toBeDefined();
  render(
    <MemoryRouter initialEntries={["/estacion/1"]}>
      {route!.element}
    </MemoryRouter>,
  );
  const fallback = await screen.findByRole("status");
  expect(loader).toHaveBeenCalledTimes(1);
  expect(fallback).toHaveAttribute("data-route-module-fallback", "world1");
  expect(fallback).toHaveTextContent("Preparing your journey");
  expect(fallback).not.toHaveTextContent("Preparando el recorrido");
  await act(async () => {
    finish({
      World1RootScreen: () => (
        <main data-testid="resolved-route">Resolved test module</main>
      ),
    });
  });
  expect(screen.getByTestId("resolved-route")).toBeVisible();
  expect(screen.queryByText("Preparing your journey")).toBeNull();
});
