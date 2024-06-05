export function getOptionArr(
  arr: string[],
  optionName: string,
  optionArgLength: number
) {
  const index = arr.indexOf(optionName);

  if (index === -1) {
    return null;
  }

  if (
    arr[index + optionArgLength] === undefined
  ) {
    console.log(
      `${optionArgLength} 개의 인자를 가져올 수 없습니다. 입력된 인자가 모자랍니다.`
    );

    return null;
  }

  return arr.slice(
    index,
    index + optionArgLength + 1
  );
}
