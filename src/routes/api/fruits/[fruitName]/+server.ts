import type { RequestHandler } from '../../$types';

import fruits from 'src/services/Fruits.service';

export const GET: RequestHandler = async ({ params }) => {
	let response = 'Unexpected Error';
	let status = 500;

	try {
		const _params = params as { fruitName: string };
		const found = fruits.getByName(_params.fruitName);
		if (!found) {
			response = "Fruit's not in the basket!";
			status = 404;
		}

		response = JSON.stringify(found, null, 2);
		status = 200;
	} catch (error) {
		if (typeof error === 'string') {
			response = error;
		}
	}

	return new Response(response, { status });
};
