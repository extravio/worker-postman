import { env, createExecutionContext, waitOnExecutionContext, SELF, fetchMock} from 'cloudflare:test';
import { beforeAll, afterEach, describe, it, expect } from 'vitest';
import worker from '../src';

beforeAll(() => {
	// Enable outbound request mocking...
	fetchMock.activate();
	// ...and throw errors if an outbound request isn't mocked
	fetchMock.disableNetConnect();
  });
// Ensure we matched every mock we defined
afterEach(() => fetchMock.assertNoPendingInterceptors());

describe('Hello World worker', () => {
	it('responds with Hello World! (unit style)', async () => {
		fetchMock
			.get("http://postman-echo.com")
			.intercept({ path: "/get" })
			.reply(200, { url: "http://mysite/get"});

		const request = new Request('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`"http://mysite/get"`);
	});

	it('responds with Hello World! (integration style)', async () => {
		fetchMock
			.get("http://postman-echo.com")
			.intercept({ path: "/get" })
			.reply(200, { url: "http://mysite/get"});

		const response = await SELF.fetch("http://example.com");
		expect(await response.text()).toMatchInlineSnapshot(`"http://mysite/get"`);
	});
});
