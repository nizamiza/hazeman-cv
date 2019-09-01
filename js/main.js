import Nav from './modules/nav.js';
import Router from './router.js';

(async () => {

	const components = new Map([
		['nav', './components/nav.html'],
		['footer', './components/footer.html']
	]);

	for (const component of components) {

		const response = await window.fetch(component[1]);
		const responseText = await response.text();

		document.querySelector(component[0]).innerHTML = responseText;
	}

	const views = {
		me: {
			template: './views/me.html'
		},

		art: {
			template: './views/art.html',
			module: {
				name: 'Art', 
				path: './modules/art.js'
			}
		},

		contact: {
			template: './views/contact.html'
		}
	};

	new Nav({
		
		toggleButton: document.querySelector('#nav__toggle'), 
		content: document.querySelector('#nav__content'),

		router : new Router({
			container: document.querySelector('#main'), 
			views: views, 
			defaultState: { view: 'me', title: 'Me' }
		})
	});

	// :: Service Worker...

	(async () => {
		
		if ('serviceWorker' in navigator) {

			try {

				const registration = await navigator.serviceWorker.register('./serviceWorker.js');
				console.log('Service Worker registration successful with scope: ', registration.scope);

			} catch (error) {
				console.log('Service Worker registration failed: ', error);
			}
		}
	})();
})();