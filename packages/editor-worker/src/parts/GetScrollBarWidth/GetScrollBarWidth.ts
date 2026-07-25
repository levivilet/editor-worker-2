const minimumSliderSize = 20

export const getScrollBarWidth = (width: number, contentWidth: number): number => {
  if (width <= 0 || width >= contentWidth) {
    return 0
  }
  return Math.max(Math.round(width ** 2 / contentWidth), minimumSliderSize)
}
