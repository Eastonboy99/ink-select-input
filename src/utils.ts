const arrRotate = (input: Array<any>, n: number) => {
    const x = input.slice();
	const num = typeof n === 'number' ? n : 0;

	return x.splice(-num % x.length).concat(x);
}

export {arrRotate}