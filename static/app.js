jQuery( document ).ready(function() {
    parentElem= jQuery('.future-forcasts').find('.future-forcasts-blocks') 

    fetchApi=function(city){
        var coordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=637d3ef92eb55ef9240a3ef3795ee168';

        fetch(coordinates)
            .then(response => response.json())
            .then(function (data) {
                var weather = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=637d3ef92eb55ef9240a3ef3795ee168';

                fetch(weather)
                    .then(response => response.json())
                    .then(function (data) {
                        jQuery('.current-forcasts').find('.city').html(data.city.name)
                        displayInfo(data);
                        addButton(data.city.name);
                    })
            })
    }
    setupPrevSearch=function(){
       sw= jQuery(this).attr('data-search')
        fetchApi(sw);
    }

    setupSearch=function(){
        sw = jQuery('.search-input').val()
        url='/search/'+sw;
        if(sw!=''){
            fetchApi(sw);
        }
    }


    
     jQuery('.search-btn').on("click",setupSearch)
     //jQuery('.search-cities').find('button').on("click",setupPrevSearch)
     addButton=function(city) { 
        cityid=city.replace(" ","_");
        jQuery('.search-cities').find('#'+cityid).remove()
        html= '<button type="button" id="'+cityid+'"  data-search="'+city+'" class="w3-block w3-button w3-margin-bottom w3-grey w3-round w3-round search-btn">'+city+'</button>';
        jQuery('.search-cities').append(html)
        jQuery('.search-cities').find('#'+cityid).on("click",setupPrevSearch)
    }
    getDate=function(day) { 
        dateFormat= new Date() ; return currdate=(dateFormat.getDate()+day)+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear() 
    }
    displayInfo=function(data) { 
        first_item= data.list[0];
        temp=first_item.main.temp;
        humidity=first_item.main.humidity;
        wind=first_item.wind.speed; 
        weatherIcon=first_item.weather[0].icon; 
        dateFormat = new Date(first_item.dt * 1000);
        currDateString=dateFormat.getDate()+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear()
        
        jQuery('.current-forcasts').find('.currdate').html(currDateString)
        jQuery('.current-forcasts').find('.temp').html(temp)
        jQuery('.current-forcasts').find('.wind').html(wind)
        jQuery('.current-forcasts').find('.humidity').html(humidity)
        jQuery('.current-forcasts').find('.wicon').attr("src","https://openweathermap.org/img/wn/"+weatherIcon+"@2x.png")
         
        var prevDateString='';
        var listIgnoreItem=0;
        fiveDayData=[];
        var future_forcasts_html='';
        data.list.forEach(function(item ){
            var dateFormat = new Date(item.dt * 1000);
            currDateString=dateFormat.getDate()+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear()
                //ignore First Item Completely because It has been displayed on Top
                if((currDateString!=prevDateString) && (currdate!=currDateString)){
                    item.dt=currDateString;
                    item.weatherIcon=item.weather[0].icon;

                    jQuery('.future-forcasts').find('.block-template').find('.currdate').html(currDateString)
                    jQuery('.future-forcasts').find('.block-template').find('.temp').html(item.main.temp)
                    jQuery('.future-forcasts').find('.block-template').find('.wind').html(item.wind.speed)
                    jQuery('.future-forcasts').find('.block-template').find('.humidity').html(item.main.humidity)
                    jQuery('.future-forcasts').find('.block-template').find('.wicon').attr("src","https://openweathermap.org/img/wn/"+item.weather[0].icon+"@2x.png")
                    blockhtml=jQuery('.future-forcasts').find('.block-template').html()
                    future_forcasts_html+=blockhtml;
                    fiveDayData.push(item)
                    prevDateString=currDateString;
                }
        }) 
     parentElem.html(future_forcasts_html);
    }
    var dateFormat = new Date();
    var currdate=dateFormat.getDate()+"/"+dateFormat.getMonth()+ "/"+dateFormat.getFullYear()
    jQuery('.current-forcasts').find('.currdate').html(currdate)

    all_block_html='';
    
    for(i=1;i<6;i++){
        currdate=getDate(i)
        jQuery('.future-forcasts').find('.currdate').html(currdate)
        blockhtml=jQuery('.future-forcasts').find('.block-template').html()
        all_block_html+=blockhtml;
    }
    parentElem.html(all_block_html)
    
});