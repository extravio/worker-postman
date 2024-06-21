const postman = {

  async get() {
		const response = await fetch("http://postman-echo.com/get");
		const data = await response.json();
		return data.url;
	}
}

export default postman;