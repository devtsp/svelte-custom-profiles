import type { RequestHandler } from './$types';

import fruits from 'src/lib/services/Fruits.service';

export const POST: RequestHandler = async ({ request }) => {
	let body;
	let response = 'Unexpected Error';
	let status = 500;

	try {
		body = await request.json();
	} catch (error) {
		response = 'Bad request body';
		status = 400;
	}

	try {
		fruits.add(body);
		response = `Succesfully created a ${body.name}!`;
		status = 200;
	} catch (error) {
		if (typeof error === 'string') {
			response = error;
		}
	}

	return new Response(response, { status });
};

export const GET: RequestHandler = async ({ request }) => {
	let response = 'Unexpected Error';
	let status = 500;

	try {
		const jsonFruitsList = fruits.getAll();
		response = JSON.stringify(jsonFruitsList, null, 4);
		status = 200;
	} catch (error) {
		if (typeof error === 'string') {
			response = error;
		}
	}

	return new Response(response, { status });
};
