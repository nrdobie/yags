function getNextSortIndex<TCollection extends { sortIndex: number }[]>(
  collection: TCollection,
) {
  return (
    collection.reduce((max, item) => Math.max(max, item.sortIndex), -1) + 1
  );
}

export { getNextSortIndex };
