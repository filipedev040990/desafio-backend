jest.mock('pino', () => {
  return jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn()
  }))
})
