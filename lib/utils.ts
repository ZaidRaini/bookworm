export function formatMemberSince(dateString: string | Date): string {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", {
    month: "short",
  });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

export function formatPublisDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDay();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
