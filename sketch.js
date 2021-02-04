export default function print({
	rowsTotal = 20,
	columnsTotal = 25,
	bezierSampleResolution = .001,
	noFillSymbol = '🤍',
	fillSymbol = '❤️',
	cubicBezierPointBundles = [
		[
			[.5, 1], 
			[0, .5], 
			[.25, 0], 
			[.5, .25]
		],
		[
			[.5, 1], 
			[1, .5], 
			[.75, 0], 
			[.5, .25]
		]
	]} = {}) {
		const bezierCubic = (vs, t) => {
			return [
				((1 - t) ** 3) * vs[0][0] + 3 * ((1 - t) ** 2) * t * vs[1][0] + 3 * (1 - t) * (t ** 2) * vs[2][0] + (t ** 3) * vs[3][0],
				((1 - t) ** 3) * vs[0][1] + 3 * ((1 - t) ** 2) * t * vs[1][1] + 3 * (1 - t) * (t ** 2) * vs[2][1] + (t ** 3) * vs[3][1]
			];
		}
		const columnBoundArea = {};
		const stepSizes = { 
			column: 1 / columnsTotal, 
			row: 1 / rowsTotal 
		};
		for(let i = 0; i < rowsTotal; i++) {
			let availableVerticalArea = [
				i * stepSizes.row, 
				(i + 1) * stepSizes.row
			];
			let columnBoundsBundle = [];
			for(let k = 0; k < cubicBezierPointBundles.length; k++) {
				let points = cubicBezierPointBundles[k];
				let columnBounds = {
					lower: null,
					upper: null
				}
				for(let j = 0; j <= 1; j += bezierSampleResolution) {
					let sample = bezierCubic(points, j);
					if(!(sample[1] >= availableVerticalArea[0] && sample[1] <= availableVerticalArea[1])) continue; // if not within the bound
					let x = sample[0];
					if(columnBounds.lower === null) columnBounds = { ...columnBounds, lower:x, upper:x };
					if(x < columnBounds.lower) columnBounds.lower = x;
					if(x > columnBounds.upper) columnBounds.upper = x;
				}
				if(columnBounds.lower !== null) columnBoundsBundle.push(columnBounds);
			}
		
			columnBoundArea[i] = [];
			for(let j = 0; j < columnBoundsBundle.length; j++) {
				let columnBounds = columnBoundsBundle[j];
				[
					columnBounds.lower, 
					columnBounds.upper
				] = [
					columnBounds.lower, 
					columnBounds.upper].map(value => Math.floor(value / stepSizes.column));
				columnBoundArea[i][j] = columnBounds;
			}
		}
		

		const maxRowStrLen = rowsTotal.toString().length;
		for(let i = 0; i < rowsTotal; i++) {
			let rowContent = [];
			let columnBoundsBundle = columnBoundArea[i];
			let isAnyBoundsForRowDefined = columnBoundsBundle !== undefined && columnBoundsBundle.length > 0;
			if(isAnyBoundsForRowDefined) {
				let dotty = {}
				for(let k = 0; k < columnBoundsBundle.length; k++) {
					let columnBounds = columnBoundsBundle[k];
					for(let i = columnBounds.lower; i <= columnBounds.upper; i++) {
						dotty[i] = true;
					}
				}
				for(let j = 0; j < columnsTotal; j++) {
					let doFillWithSymbol = dotty[j] !== undefined;
					rowContent.push(doFillWithSymbol ? fillSymbol : noFillSymbol);
				}
			} else {
				rowContent.push(noFillSymbol.repeat(columnsTotal));
			}
		
			let totalOfLeadingZeroesToAdd = Math.max(0, maxRowStrLen - i.toString().length);
			let strIndexPart = '0'.repeat(totalOfLeadingZeroesToAdd) + i;
			let row = strIndexPart + ':' + rowContent.join('');
			console.log(row);
		}
		const auth = 'With 🖤 from @Eleseer';
		console.log(' '.repeat(42) + auth);
	}