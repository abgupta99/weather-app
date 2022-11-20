 

const express = require('express');
const request = require('request');
const path=require("path");
//var cors = require('cors')
const port=3000;
let publicPath= path.resolve(__dirname,"public")


const app = express();
//app.use(cors());
app.use(express.static(publicPath))
app.listen(process.env.port || 3000, () => console.log('Server started on port 3000'));

  app.get("/", function (req, res) {
      res.sendFile(path.join(__dirname + "/client.html"))})//uses to send html file as a response using localhost:3000
app.get('/weather/:city', (req, res) => {   
	let city =req.params.city;  //it take city data from html file
	
	var request = require('request');
	request(
		`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=4b79f6962321a1d561273e543cb70606`,
		function (error, response, body) {
			
			let data = JSON.parse(body);  
			if(data.message=='city not found')
			{
				res.send(data);
			} 
			if (response.statusCode === 200) {
				//res.send(`The weather in your "${city} is ${data.list[0].weather[0].description}`);
			let array=[];//created a array to get list in it 
			for(var i=0;i<28;i=i+2)
			{
				array.push(data.list[i]);
			}
			//res.send(array);
			var string='{"rain":{},"temp":{},"pol":{},"message":{},"list":[]}';  //it is the main object in which data will be passed
			var obj=JSON.parse(string); 
	//here we will make our list for table
	for(var day in array)        //it will collect weather of adata upto 4 days with 6 hours of interval 
	{
		var temp=array[day].main.temp;
		var wind=array[day].wind.speed;
		var date=array[day].dt_txt;
		if(array[day].rain!=undefined)
		{
		var rainlevel=array[day].rain['3h'];
		}
		else
		{
			var rainlevel='No Rain';
		}
		obj.list.push(   //will be used for table
			{
				"Date":date,
				"temp":temp,
				"wind":wind,
				"RAIN":rainlevel
			}
		);
		//rain level
	}
			
			obj.message=0
			obj.rain=rain(array);    //to check wthere there is rain or no
			obj.temp=tmp(array);   //to check what to pack
			//res.setHeader("Access-Control-Allow-Origin", "*");
			//res.render(__dirname+"client.html",obj);
			
			let lon=data.city.coord.lon;//it is used to get city coordinates which will be further used in pollution 
			let lat=data.city.coord.lat;
			//res.json(data.city.coord);
			request(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=4b79f6962321a1d561273e543cb70606`,function(error,response,body)
			{//another api requested to get pollution
				if(response.statusCode==200)
				{  let ansp='This area is safe no mask needed';
					let datap = JSON.parse(body);
						for(var i=0;i<datap.list.length;i++)
						{
							if(datap.list[i].components.pm2_5>10)
								{
									ansp='You need Mask in This Area'   //it will wether we need mask or not
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
	 //simple approach to tell user what he can pack 
	 if(arr[0].main.temp-273.15<=10)
	 {
	 	return "It will be cold so pack accordingly"
	 }
		else if(arr[0].main.temp-273.15>10 && arr[0].main.temp-273.15<=21)
 		{
 			return "It will be Warm so pack accordingly"
 		}
 		else{
 			return "It will be hot so pack accordingly"
 		}
 	
}
function rain(arr)
{   //just a very simple approach to check whether there will be rain or not
	for(var day in arr)
	{
		if(arr[day].weather[0].main=='Thunderstorm'||arr[day].weather[0].main=='Drizzle'||arr[day].weather[0].main=='Rain')
		{
			return "There will be rain so Take umbrella"
		}
		
		
		
	}
	return "No need of umbrella!Hurray"
}

