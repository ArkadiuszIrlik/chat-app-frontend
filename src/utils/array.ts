function getUniqueObjectArray<T>(
  array: Record<string, T>[],
  uniqueKeys: string[],
  keepFirst = true,
): Record<string, T>[] {
  return Array.from(
    array
      .reduce<Map<string, Record<string, T>>>((map, obj) => {
        const key = uniqueKeys
          .map((k) => [obj[k], typeof obj[k]])
          .flat()
          .join('-');
        if (keepFirst && map.has(key)) return map;
        return map.set(key, obj);
      }, new Map())
      .values(),
  );
}

export { getUniqueObjectArray };
