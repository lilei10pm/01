function myplot(){
	//if(window.isPollutionTrend){
		var canvasLayerBack = new CanvasLayer({
        map: window.map,
        update: update2
    });
    var canvasLayer = new CanvasLayer({
        map: window.map,
        update: update
    });

    var ctx = canvasLayer.canvas.getContext("2d");
	var backCtx = canvasLayerBack.canvas.getContext('2d');
	canvasLayerBack.canvas.style.display="none"
	//window.canvasLayer=canvasLayer

	function drawBackCanvas(fitModel){
        if(!window.rgn)return
        backCtx.clearRect(0, 0, backCtx.canvas.width, backCtx.canvas.height);
        var temp = {};
        let [lng_max,lng_min,lat_max,lat_min]=[lg_max,lg_min, la_max, la_min]
        //console.log(lng_max,lng_min,lat_max,lat_min)
      //  return
        let cnt=0
        let prepixel
        let w=0
       

     /*  _.map( rs1[0].split(";"),function(item){
         a.push(item.split(",").join())
       })*/
      // console.log(aa)
      for (var lat = lat_min;lat<lat_max;lat =lat+0.01) {
           for(var lng =lng_min;lng<lng_max;lng=lng+0.01) {
              //  console.log(lng, lat)
           //  for(let i of aa){
                 let pt = new BMap.Point(lng, lat)
                 var pixel = map.pointToPixel(pt);
                 var tnew = kriging.predict(lng, lat, fitModel);
                 // console.log(tnew)
                 var colors = ["#00A600", "#01A600", "#03A700", "#04A700", "#05A800", "#07A800", "#08A900", "#09A900", "#0BAA00", "#0CAA00", "#0DAB00", "#0FAB00", "#10AC00", "#12AC00", "#13AD00", "#14AD00", "#16AE00", "#17AE00", "#19AF00", "#1AAF00", "#1CB000", "#1DB000", "#1FB100", "#20B100", "#22B200", "#23B200", "#25B300", "#26B300", "#28B400", "#29B400", "#2BB500", "#2CB500", "#2EB600", "#2FB600", "#31B700", "#33B700", "#34B800", "#36B800", "#37B900", "#39B900", "#3BBA00", "#3CBA00", "#3EBB00", "#3FBB00", "#41BC00", "#43BC00", "#44BD00", "#46BD00", "#48BE00", "#49BE00", "#4BBF00", "#4DBF00", "#4FC000", "#50C000", "#52C100", "#54C100", "#55C200", "#57C200", "#59C300", "#5BC300", "#5DC400", "#5EC400", "#60C500", "#62C500", "#64C600", "#66C600", "#67C700", "#69C700", "#6BC800", "#6DC800", "#6FC900", "#71C900", "#72CA00", "#74CA00", "#76CB00", "#78CB00", "#7ACC00", "#7CCC00", "#7ECD00", "#80CD00", "#82CE00", "#84CE00", "#86CF00", "#88CF00", "#8AD000", "#8BD000", "#8DD100", "#8FD100", "#91D200", "#93D200", "#95D300", "#97D300", "#9AD400", "#9CD400", "#9ED500", "#A0D500", "#A2D600", "#A4D600", "#A6D700", "#A8D700", "#AAD800", "#ACD800", "#AED900", "#B0D900", "#B2DA00", "#B5DA00", "#B7DB00", "#B9DB00", "#BBDC00", "#BDDC00", "#BFDD00", "#C2DD00", "#C4DE00", "#C6DE00", "#C8DF00", "#CADF00", "#CDE000", "#CFE000", "#D1E100", "#D3E100", "#D6E200", "#D8E200", "#DAE300", "#DCE300", "#DFE400", "#E1E400", "#E3E500", "#E6E600", "#E6E402", "#E6E204", "#E6E105", "#E6DF07", "#E6DD09", "#E6DC0B", "#E6DA0D", "#E6D90E", "#E6D710", "#E6D612", "#E7D414", "#E7D316", "#E7D217", "#E7D019", "#E7CF1B", "#E7CE1D", "#E7CD1F", "#E7CB21", "#E7CA22", "#E7C924", "#E8C826", "#E8C728", "#E8C62A", "#E8C52B", "#E8C42D", "#E8C32F", "#E8C231", "#E8C133", "#E8C035", "#E8BF36", "#E9BE38", "#E9BD3A", "#E9BC3C", "#E9BB3E", "#E9BB40", "#E9BA42", "#E9B943", "#E9B945", "#E9B847", "#E9B749", "#EAB74B", "#EAB64D", "#EAB64F", "#EAB550", "#EAB552", "#EAB454", "#EAB456", "#EAB358", "#EAB35A", "#EAB35C", "#EBB25D", "#EBB25F", "#EBB261", "#EBB263", "#EBB165", "#EBB167", "#EBB169", "#EBB16B", "#EBB16C", "#EBB16E", "#ECB170", "#ECB172", "#ECB174", "#ECB176", "#ECB178", "#ECB17A", "#ECB17C", "#ECB17E", "#ECB27F", "#ECB281", "#EDB283", "#EDB285", "#EDB387", "#EDB389", "#EDB38B", "#EDB48D", "#EDB48F", "#EDB591", "#EDB593", "#EDB694", "#EEB696", "#EEB798", "#EEB89A", "#EEB89C", "#EEB99E", "#EEBAA0", "#EEBAA2", "#EEBBA4", "#EEBCA6", "#EEBDA8", "#EFBEAA", "#EFBEAC", "#EFBFAD", "#EFC0AF", "#EFC1B1", "#EFC2B3", "#EFC3B5", "#EFC4B7", "#EFC5B9", "#EFC7BB", "#F0C8BD", "#F0C9BF", "#F0CAC1", "#F0CBC3", "#F0CDC5", "#F0CEC7", "#F0CFC9", "#F0D1CB", "#F0D2CD", "#F0D3CF", "#F1D5D1", "#F1D6D3", "#F1D8D5", "#F1D9D7", "#F1DBD8", "#F1DDDA", "#F1DEDC", "#F1E0DE", "#F1E2E0", "#F1E3E2", "#F2E5E4", "#F2E7E6", "#F2E9E8", "#F2EBEA", "#F2ECEC", "#F2EEEE", "#F2F0F0", "#F2F2F2"];
                 backCtx.fillStyle = getgradientcolor("pm25",tnew);
                 backCtx.beginPath();
              //
                 if(w){
                     backCtx.fillRect(pixel.x, pixel.y,w ,w);
                 }
                 if(prepixel && w==0){
                     w=(pixel.x-prepixel.x)*1.38+1
                 }
                 prepixel=pixel
          //   }


          }
       }
	}
 function draw(){
			
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 0.7;
        ctx.drawImage(canvasLayerBack.canvas, 0, 0, canvasLayerBack.canvas.width, canvasLayerBack.canvas.height);
 
    }
	function update2(){
		if (!backCtx) {
            return;
        }
		drawBackCanvas(window.fitModel)
	}
    function update() {

        if (!ctx) {
            return;
        }
		
        draw()
    }
    window.update=update
    window.drawBackCanvas=drawBackCanvas

	//}
	
	


}