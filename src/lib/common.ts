export function getPaginationOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
