const array1: number[] = [1, 2, 3, 4, 5];
// @ts-expect-error added functionality by the plugin
const array2: number[] = array1 + [0, 0];

if (!Array.isArray(array2)) {
	console.log(array1, array2);
	throw Error(
		`The two arrays [${array1.join(",")}] & ${JSON.stringify(
			array2
		)} were not merged`
	);
}
