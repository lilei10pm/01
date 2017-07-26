/**
 * Created by Administrator on 2017/7/17 0017.
 */
(function() {


    var canvasWidth = 500
    var clickPoint={x:-1,y:-1}
    var clicked=false
    function ArrowPath(ctx, innerR, lentgh, ang){
        ctx.rotate(ang)
        ctx.translate(innerR,0)

        ctx.strokeStyle = "black";
        ctx.beginPath()
        b0=5
        b1=4
        ctx.moveTo(0,b0)
        ctx.lineTo(lentgh,b0)
        ctx.lineTo(lentgh,b0+b1)
        ctx.lineTo(lentgh+10,0)
        ctx.lineTo(lentgh,-(b0+b1))
        ctx.lineTo(lentgh,-b0)
        ctx.lineTo(0,-b0)
        ctx.closePath()
    }
    function DrawArrow(ctx, innerR, lentgh, ang) {

        ctx.save()
        ArrowPath(ctx, innerR, lentgh, ang)
        ctx.stroke()
        ctx.fill()


        ctx.restore();   //恢复到堆的上一个状态，其实这里没什么用。


    }
    function DrawText(ctx,R,text){
        ctx.beginPath()
        ctx.strokeStyle="gray"
        ctx.fillStyle = "white";
        ctx.font = "15px serif";
        ctx.textAlign="center"
        ctx.textBaseline="middle"
        ctx.lineWidth=1
        ctx.fillText(text,0,0)
        ctx.strokeText(text,0,0)
    }
    function DrawCircle(ctx, R, value) {



        ctx.arc(0,0,R,0,2*Math.PI)
        ctx.fill();
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle="white"
        ctx.arc(0,0,R+1,0,2*Math.PI)
        ctx.stroke();

        ctx.beginPath()

        ctx.arc(0,0,R+2,0,2*Math.PI)

        ctx.strokeStyle="black"
        clicked=false
        if(ctx.isPointInPath(clickPoint.x,clickPoint.y)){
            ctx.strokeStyle="white"
            clicked=true
        }
        ctx.stroke();
        DrawText(ctx,R,value)

        ctx.restore()


    }


    function CanvasOverlay() {
        this._stations=[]
        this._R=20

    }

    CanvasOverlay.prototype = new BMap.Overlay();

    CanvasOverlay.prototype.initialize = function (map) {
        this._map = map;
        //var div = this._div = document.createElement("div");
        var canvas=this.canvas = document.createElement('canvas')
        var ctx = canvas.getContext("2d")
        // div.appendChild(canvas)
        canvas.width = this._map.getSize().width
        canvas.height = this._map.getSize().height
        this._ctx = ctx
        canvas.style.position = "absolute";
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.border = 0;
        canvas.style.width = this._map.getSize().width + "px";
        canvas.style.height = this._map.getSize().height + "px";

        this._width=this._map.getSize().width
        this._height=this._map.getSize().height
        var that  = this;
        map.addEventListener('resize', function(e){
            var size = e.size;
            canvas.style.width = size.width + "px";
            canvas.style.height = size.height + "px";
            that.setDimensions(size.width, size.height);
            that.draw();
        });
        canvas.onmouseover = function () {
            //this.style.backgroundColor = "#6BADCA";
            this.style.borderColor = "#0000ff";

        }

        canvas.onmouseout = function () {
            //this.style.backgroundColor = "#EE5D5B";
            this.style.borderColor = "#BC3B3A";

        }
        var that = this
        canvas.onclick = function (e) {
            // e.stopPropagation()
            var x= e.clientX-canvas.getBoundingClientRect().left
            var y= e.clientY-canvas.getBoundingClientRect().top
            clickPoint={x:x,y:y}
            that.draw()
            return

        }


        mp.getPanes().labelPane.appendChild(canvas);
        return canvas;
    }

    CanvasOverlay.prototype.drawStation=function(ctx,station){
        var wind_speed=parseFloat(station.sensordata.wind_speed)
        var wind_direction=parseFloat(station.sensordata.wind_direction)
        ctx.fillStyle=getgradientcolor("pm25", station.sensordata.pm25)
        if( !isNaN(wind_speed) && !isNaN(wind_direction) &&wind_speed>0){
            DrawArrow(ctx,this._R,0+10*wind_speed,((wind_direction+90)*2*Math.PI)/360)
        }
        DrawCircle(ctx,this._R,station.sensordata.pm25)
        //  console.log(station.sensordata)

    }
    CanvasOverlay.prototype.setDimensions=function(width, height) {
        this._width = width;
        this._height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
    CanvasOverlay.prototype.draw = function () {
        var map = this._map;
        var currentBounds = this._map.getBounds();

        this.bounds = currentBounds;

        var ne = this._map.pointToOverlayPixel(currentBounds.getNorthEast()),
            sw = this._map.pointToOverlayPixel(currentBounds.getSouthWest()),
            topY = ne.y,
            leftX = sw.x,
            h = sw.y - ne.y,
            w = ne.x - sw.x;
        this.canvas.style.left = leftX + 'px';
        this.canvas.style.top = topY + 'px';
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        var ctx=this.canvas.getContext("2d")
        ctx.clearRect(0,0,this._width, this._height)
        //console.log("draw")
        ctx.shadowBlur=10
        // ctx.shadowColor="#666"
        ctx.shadowOffsetX=5
        ctx.shadowOffsetY=5
        for(var i in this._stations){
            var station=this._stations[i]
            if(!station.sensordata||!station.sensordata.pm25){
                continue
            }
            ctx.save()

            var point=new BMap.Point(station.station.Lng, station.station.Lat)
            var pixel = this._map.pointToOverlayPixel(point),
                leftX = this._map.pointToOverlayPixel(currentBounds.getSouthWest()).x,
                topY = this._map.pointToOverlayPixel(currentBounds.getNorthEast()).y,
                screenPixel = new BMap.Pixel(pixel.x - leftX, pixel.y - topY);

            ctx.translate(screenPixel.x,screenPixel.y)

            this.drawStation(ctx,station)
            ctx.restore()
            if(clicked){
                var sContent = "<h2>" + station.station.Name + "</h2>" +
                    "<p>pm2.5:" + station.sensordata.pm25 + "</p>" +
                    "<p>pm10:" + station.sensordata.pm10 + "</p>" +
                    "<p>time:" + moment(station.sensordata.TIME).format("YYYY-MM-DD HH:mm") + "</p>"
                var infoWindow = new BMap.InfoWindow(sContent);
                map.openInfoWindow(infoWindow, new BMap.Point(station.station.Lng, station.station.Lat))
                clickPoint={x:-1,y:-1}
            }
        }

        //  this._div.style.left = pixel.x - canvasWidth / 2 + "px";
        //  this._div.style.top = pixel.y - canvasWidth / 2 + "px";
    }
    CanvasOverlay.prototype.setStations=function(stations){
        this._stations=stations
        this.draw()
    }
    CanvasOverlay.prototype.setParams=function(radius){
        this._R=radius
        //   this.draw()
    }
    window.ComplexCustomOverlay = CanvasOverlay
})()
