export const ok = <T>(data: T) => ({ data })

export const page = <T>(data: T[], cursor: number, hasNext: boolean) => ({
  data,
  nextCursor: hasNext ? cursor + 1 : null,
})

export const PAGE_SIZE = 24
