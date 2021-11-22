function displayGraph(graphType) {
	if (graphType < 5) {
		switch (graphType) {
			case 1:
				console.log(1);
				break;

			case 2:
				console.log(2);
				break;

			case 3:
				console.log(3);
				break;

			case 4:
				console.log(4);
				break;
		}
	} else {
		switch (graphType) {
			case 1:
				console.log(5);
				break;

			case 2:
				console.log(6);
				break;
		}
	}

	return;
}
