import { Router } from 'itty-router';
import postman from './postmanService';

// Create a new router
const router = Router();

/*
Our index route, a simple hello world.
*/
router.get('/', async() => {
  const response = await fetch("http://postman-echo.com/get");
	const data = await response.json();
	return new Response(data.url);
});

router.get('/service', async() => {
  const url = await postman.get()
	return new Response(url);
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch: router.handle,
};