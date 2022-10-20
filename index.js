 

const express = require('express');
const request = require('request');
const path=require("path");
var cors = require('cors')

let publicPath= path.resolve(__dirname,"public")


const app = express();
app.use(cors());
app.use(express.static(publicPath))
app.listen(3000, () => console.log('Server started on port 3000'));

  app.get("/", function (req, res) {
      res.sendFile(path.join(__dirname + "/client.html"))})
app.get('/weather/:city', (req, res) => {
	let city =req.params.city;
	
	var request = require('request');
	request(
		`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=4b79f6962321a1d561273e543cb70606`,
		function (error, response, body) {
			let data = JSON.parse(body);
			if (response.statusCode === 200) {
				//res.send(`The weather in your "${city} is ${data.list[0].weather[0].description}`);
			let array=[];
			for(var i=0;i<32;i=i+2)
			{
				array.push(data.list[i]);
			}
			//res.send(array);
			var string='{"rain":{},"temp":{},"pol":{},"list":[]}';
			var obj=JSON.parse(string);
	//here we will make our list for table
	for(var day in array)
	{
		var temp=array[day].main.temp;
		var wind=array[day].wind.speed;
		var date=array[day].dt_txt
		obj.list.push(
			{
				"Date":date,
				"temp":temp,
				"wind":wind
			}
		);
		//rain level
	}
			
			
			obj.rain=rain(array);
			obj.temp=tmp(array);
			//res.setHeader("Access-Control-Allow-Origin", "*");
			//res.render(__dirname+"client.html",obj);
			let lon=data.city.coord.lon;
			let lat=data.city.coord.lat;
			//res.json(data.city.coord);
			request(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=4b79f6962321a1d561273e543cb70606`,function(error,response,body)
			{
				if(response.statusCode==200)
				{  let ansp='This area is safe no mask needed';
					let datap = JSON.parse(body);
						for(var i=0;i<datap.list.length;i++)
						{
							if(datap.list[i].components.pm2_5>10)
								{
									ansp='You need Mask in This Area'
								}
							
						}
						obj.pol=ansp;
				}
				res.json(obj);
			})

			//pollution api
			
				
			
			}

			
		}
	);
});


function tmp(arr)
{
	 	for(var day in arr)
 	{
	 if(arr[day].main.temp-273.15<=10)
	 {
	 	return "It will be cold so pack accordingly"
	 }
		else if(arr[day].main.temp-273.15>10 && arr[day].main.temp-273.15<=21)
 		{
 			return "It will be Warm so pack accordingly"
 		}
 		else{
 			return "It will be hot so pack accordingly"
 		}
 	}
}
function rain(arr)
{
	for(var day in arr)
	{
		if(arr[day].weather[0].main=='Thunderstorm'||arr[day].weather[0].main=='Drizzle'||arr[day].weather[0].main=='Rain')
		{
			return "There will be rain so Take umbrella"
		}
		
		
		
	}
	return "No need of umbrella!Hurray"
}

