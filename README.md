# restaurant-menus-stats

Description
A server capable of serving the restaurant order form. The server will also be responsible for tracking some sales data for each restaurant and providing that sales data in HTML format when requested. All order data that the server stores is stored in RAM. 

Design Decisions
	I decided to keep my orginal client script and modify it so that the page is built based on the restaurant data that is sent from the server
	I decided to use modify the order page whenever the restaurant was changed, instead of requesting a brand new page from a pug template. This way, I would not have to request a whole page from the server everytime, but rather, I could just update parts of the page instead of the whole page.

Precise Instructions
	Do not change any of the paths in the downloaded folder
	To dowload pug type the following into your terminal, from inside the same directory as the server:
		npm install pug 
	To run the server, type the following into the terminal:
		node order-server.js
	To view the page in browser, type the following URL:
		http://localhost:3000
