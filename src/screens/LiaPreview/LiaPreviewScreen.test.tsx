import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LiaPreviewScreen } from "./LiaPreviewScreen";
import { liaPreviewCopy as copy } from "../../content/liaPreviewCopy";
import { askLia } from "../../features/lia-preview/client";
vi.mock("../../features/lia-preview/client", () => ({ askLia: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
function mount() {
  return render(
    <MemoryRouter>
      <LiaPreviewScreen />
    </MemoryRouter>,
  );
}
function submit(question = "¿Las plantas hacen música por sí solas?") {
  fireEvent.change(screen.getByLabelText(copy.prompt), {
    target: { value: question },
  });
  fireEvent.click(screen.getByRole("button", { name: copy.send }));
}
describe("dedicated visitor conversation", () => {
  it("escapes user text, shows approved citations and clears all session state", async () => {
    vi.mocked(askLia).mockResolvedValue({
      state: "supported",
      answer: "Un extracto",
      citations: [{ label: "Fuente pública", excerpt: "Un extracto" }],
    });
    mount();
    const question = "<img src=x onerror=alert(1)>";
    submit(question);
    await screen.findByText("Fuente pública");
    expect(screen.getByText(question).querySelector("img")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe(copy.supported);
    fireEvent.click(screen.getByRole("button", { name: copy.clear }));
    expect(screen.queryByText(question)).toBeNull();
    expect(screen.getByLabelText(copy.prompt)).toBe(document.activeElement);
  });
  it("aborts pending work on clear and ignores a late response", async () => {
    let resolve!: (value: Awaited<ReturnType<typeof askLia>>) => void;
    vi.mocked(askLia).mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    mount();
    submit();
    const signal = vi.mocked(askLia).mock.calls[0][1];
    fireEvent.click(screen.getByRole("button", { name: copy.clear }));
    expect(signal.aborted).toBe(true);
    resolve({ state: "supported", answer: "Late response", citations: [] });
    await waitFor(() => expect(screen.queryByText("Late response")).toBeNull());
  });
  it("returns a usable fallback on unavailable backend", async () => {
    vi.mocked(askLia).mockRejectedValue(new Error("synthetic failure"));
    mount();
    submit();
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe(copy.unavailable),
    );
    expect(screen.getByRole("button", { name: copy.back })).toBeTruthy();
  });
});
