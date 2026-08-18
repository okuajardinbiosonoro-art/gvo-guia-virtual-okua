export function isLocalTestRequest(url: string): boolean {
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return true;
  }

  try {
    return ["127.0.0.1", "localhost"].includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function isExpectedLocalNavigationAbort(
  url: string,
  failure: string,
): boolean {
  return failure.includes("ERR_ABORTED") && isLocalTestRequest(url);
}
