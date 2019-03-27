export const mockStart = jest.fn();
export const mockStop = jest.fn();

export const TriggerListener = jest.fn().mockImplementation(() => {
  return {
    start: mockStart,
    stop: mockStop
  };
});
