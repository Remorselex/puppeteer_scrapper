const setPagesCountArray = (count) =>
  Array(count - 0)
    .fill(0)
    .map((value, index) => value + index);

export { setPagesCountArray };
