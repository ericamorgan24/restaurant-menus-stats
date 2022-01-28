//require all necessary modules
const http = require('http');
const pug = require('pug');
const fs = require("fs");

//Set up the repetitive responses
function send404(response){
	response.statusCode = 404;
	response.write("Unknwn resource.");
	response.end();
}
function send500(response){
	response.statusCode = 500;
	response.write("Server error.");
	response.end();
}

//Set up the required data
let id = 0;
let restaurants = [];
fs.readdir('./restaurants', function(err, files){
	if(err){
		send500(response);
		return;
	}
	files.forEach(function(file) {
		let myFile = require('./restaurants/'+file);
		resto = myFile;
		resto.totalOrders = 0;
		resto.totalCost = 0;
		resto.popular = "";
		resto.allOrders = {};
		resto.id = id++;
		restaurants.push(resto);
	});
});

//Pug functions to render various pages
const renderHome = pug.compileFile('views/pages/home.pug');
const renderStats = pug.compileFile("views/pages/stats.pug");
const renderOrder = pug.compileFile("views/pages/order.pug");

//Initialize server
const server = http.createServer(function (request, response) {
	if(request.method == 'GET'){
		if(request.url == '/' || request.url == '/home'){
			let data = renderHome({restaurants});
			response.statusCode = 200;
			response.setHeader("Content-Type", "text/html");
			response.write(data);
			response.end();
		}else if(request.url == '/stats'){
			let data = renderStats({restaurants});
			response.statusCode = 200;
			response.setHeader("Content-Type", "text/html");
			response.write(data);
			response.end();
		}else if(request.url == '/order'){
			let data = renderOrder({restaurants});
			response.statusCode = 200;
			response.setHeader("Content-Type", "text/html");
			response.write(data);
			response.end();
		}else if(request.url.startsWith('/order/')){
			let choice = request.url.slice(7);
			choice = Number(choice);
			let data = restaurants[choice];
			response.statusCode = 200;
			response.setHeader("Content-Type", "text/html");
			response.write(JSON.stringify(data));
			response.end();
		}else if(request.url == '/order-client.js'){
			fs.readFile("order-client.js", function(err, data){
				if(err){
					send500(response)
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/javascript");
				response.write(data);
				response.end();
			});
		}else if(request.url == '/order.css'){
			fs.readFile("order.css", function(err, data){
				if(err){
					send500(response)
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/css");
				response.write(data);
				response.end();
			});
		}else if(request.url == '/add.jpg'){
			fs.readFile("add.jpg", function(err, data){
				if(err){
					rsend500(response)
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "image/jpeg");
				response.write(data);
				response.end();
			});
		}else if(request.url == '/remove.jpg'){
			fs.readFile("remove.jpg", function(err, data){
				if(err){
					send500(response)
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "image/jpeg");
				response.write(data);
				response.end();
			});
		}else if(request.url == '/top.png'){
			fs.readFile("top.png", function(err, data){
				if(err){
					send500(response)
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "image/png");
				response.write(data);
				response.end();
			});
		}else{
			send404(response);
		}
	}else if(request.method == 'POST'){
		if(request.url == '/order'){
			let body = "";
			request.on('data', (chunk) => {
				body += chunk;
			});
			request.on('end', () => {
				let data = JSON.parse(body);
				//find restaurant, increase number of orders and total cost
				let index = restaurants.findIndex(elem => elem.name == data.name);
				restaurants[index].totalOrders++;
				restaurants[index].totalCost += Number(data.total);
				//update object that holds all order
				data.order.forEach(function(elem){
					if(restaurants[index].allOrders[elem.name]){
						restaurants[index].allOrders[elem.name] += elem.quantity;
					}else{
						restaurants[index].allOrders[elem.name] = elem.quantity;
					}
				});
				//update most popular item
				let max = 0;
				for(let item in restaurants[index].allOrders){
					if(restaurants[index].allOrders[item] > max){
						restaurants[index].popular = item;
						max = restaurants[index].allOrders[item];

					}
				}
				response.end();
			});
		}
	}else{
		send404(response);
	}
	
});

//Start server
server.listen(3000);
console.log("Server listening at http://localhost:3000");