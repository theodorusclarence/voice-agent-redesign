/**
 * 1/0 masks (row-major, n×n) the pixel loader morphs through:
 * full → ring → diamond → plus → x → corners → checker.
 */
export function pixelFrames(n: number): number[][] {
  const center = (n - 1) / 2;
  const max = n - 1;
  const mask = (fn: (row: number, col: number) => boolean): number[] => {
    const cells: number[] = [];
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        cells.push(fn(row, col) ? 1 : 0);
      }
    }
    return cells;
  };

  return [
    mask(() => true),
    mask((row, col) => row === 0 || col === 0 || row === max || col === max),
    // +0.01 absorbs float error so the diamond keeps its edge cells on odd sizes
    mask(
      (row, col) =>
        Math.abs(row - center) + Math.abs(col - center) <= center + 0.01
    ),
    mask(
      (row, col) => Math.abs(row - center) < 1 || Math.abs(col - center) < 1
    ),
    mask((row, col) => row === col || row + col === max),
    mask(
      (row, col) => (row === 0 || row === max) && (col === 0 || col === max)
    ),
    mask((row, col) => (row + col) % 2 === 0),
  ];
}
