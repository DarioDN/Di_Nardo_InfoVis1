/*
* Inizializzazione e creazione degli elementi base dello script come bottoni, l'svg
*  il tooltip e alcune variabili.
*/
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");

buttonDiv = d3.select("body").append("div")
    .attr("id","buttonDiv");

buttonDiv.append("button")
    .attr("onclick","baseVersion()")
    .text("Versione base");

buttonDiv.append("button")
    .attr("onclick","restart()")
    .text("Ricomincia");

var margin = {top: 20, right: 20, bottom: 30, left: 40};

var width = 1100 - margin.left - margin.right;
var height = 1100 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("y", 200)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var mouseoverColor = "#B03A2E";
/*
* Carica il file.json e passa i dati al metodo init
*/
d3.json("data/dataset.json")
    .then(function(data) {
        init(data);
    })
    .catch(function(error) {
        console.log(error);
        d3.json("https://gist.githubusercontent.com/DarioDN/fd26f6b5b789e8af5ff832697aa61b6d/raw/4a4979875531375eae7809018733a2f118f823d6/smallMenDataset.json")
            .then(function(data) {
                init(data);
            })
            .catch(function(error) {
                console.log(error);
            });

    });

/*
* Funzione pricipale che crea gli elementi della legenda, gli omini e il pannello dei dati,
* dopodichè assegna agli elementi le varie funzioni attivate da eventi quali "mouseover", "mouseout",
* "mouseout" e "click".
*/
function init(data){

    //creazione della legenda
    drawLegend();

    /*
    * Si chiama la funzione su ogni omino in maniera indipendente al fine di farlo appartenere
    *  a un unico gruppo e poter operare sulle proprietà del gruppo invece che della singola
    *  componente.
    */
    for(let i = 0; i<data.length; i++) {
        drawSmallMen(data[i],i);
    }

    //creazione del pannello
    drawPanel();

    /*
    * Sono scritte ora 4 funzioni uguali per ogni elemento che rappresenta una delle 4 variabili
    * del file .json, ovvero:
    * -Grandezza della testa (v1)
    * -Larghezza del busto (v2)
    * -Lunghezza delle braccia (v3)
    * -Lunghezza delle gambe (v4)
    *
    *  commento solo le funzioni relative alla testa, poiché gli altri commenti sarebbero
    *  ridondati.
    */

    /*
    * Evidenzia le teste di tutti gli omini al "mouseover" per mettere in evidenza su quale
    *  variabile si andrà ad ordinare gli omini.
    */
    d3.selectAll('.head').on("mouseover",function() {
        d3.selectAll('.head').style("fill",mouseoverColor);

        div.text("Ordina per la grandezza della testa")
            .style("display", "inline");
    });

    /*
    * Rimuove l'evidenziazione al "mouseout".
    */
    d3.selectAll('.head').on("mouseout",function() {
        div.style("display", "none");
        d3.selectAll('.head').style("fill","black");

    });

    /*
    * Riposiziona il tooltip in base alla posizione del mouse.
    */
    d3.selectAll('.head').on("mousemove",function() {
        div.style("left", (d3.event.pageX +20) + "px")
            .style("top", (d3.event.pageY -20) + "px");
    });

    /*
    * Al click del mouse su una testa riodina gli omini in base alla grandezza della testa
    */
    d3.selectAll('.head').on("click",function() {
        /*
        * preleva i dati dei vari elementi tramite la selezione di d3.js
        */
        data = []
        circles = d3.selectAll(".head").selectAll("__data__")._parents;
        headsDim = []
        for (let i = 0; i < circles.length; i++) {
            headsDim.push(circles[i].__data__.v1)
            data.push(circles[i].__data__)
        }

        /*
        * calcola un array dove la coppia <indice, valore> indicano la pozione attuale dell'omino
        * e quella di destinazione.
        */
        orderedHeadsDim = headsDim.sort(d3.ascending)
        indexFromTo = []
        for (let i = 0; i < orderedHeadsDim.length; i++) {
            for (let j = 0; j < data.length; j++){
                if(data[i].v1===orderedHeadsDim[j]) {
                    indexFromTo[i]=j;
                    orderedHeadsDim[j]=-1;
                    break;
                }
            }
        }
        for (let i = 0; i < indexFromTo.length; i++) {
            /*
            * sposta il singolo omino muovendolo in due fasi distinte.
            */
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))/4  +","+Math.sign((-(i*100)+(indexFromTo[i]*100)))*50+")");
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500).delay(1400)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");

            /*
            * sposta il singolo omino muovendolo in una singola fase.
            */
            // d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500)
            //     .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");

            /*
            * riporta il font-weight a normal per tutti i valori prima di rievidenziare quelli selezionati
            */
            d3.selectAll(".text").style("font-weight","normal");

            /*
            * porta in alto i valori della legenda relativi alla testa e li evidenzia.
            */
            d3.selectAll("#group" + i).selectAll(".textV1").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 0 + ")")
                .style("font-weight","bold");
            d3.selectAll("#group" + i).selectAll(".textV2").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 0 + ")");
            d3.selectAll("#group" + i).selectAll(".textV3").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 0 + ")");
            d3.selectAll("#group" + i).selectAll(".textV4").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 0 + ")");

            /*
            * porta in alto l'intestazione della legenda relativa alla testa e la evidenzia.
            */
            d3.selectAll("#grouplegend").selectAll(".textV1").transition().duration(3000)
                .attr("transform", "translate(0," + 0 + ")")
                .style("font-weight","bold");
            d3.selectAll("#grouplegend").selectAll(".textV2").transition().duration(3000)
                .attr("transform", "translate(0," + 0 + ")");
            d3.selectAll("#grouplegend").selectAll(".textV3").transition().duration(3000)
                .attr("transform", "translate(0," + 0 + ")");
            d3.selectAll("#grouplegend").selectAll(".textV4").transition().duration(3000)
                .attr("transform", "translate(0," + 0 + ")");

        }

    })

    /*
    * Funzioni per la larghezza del busto
    */
    d3.selectAll('.body').on("mouseover",function() {
        d3.selectAll('.body').style("fill",mouseoverColor);

        div.text("Ordina per la larghezza del busto")
            .style("display", "inline");
    });

    d3.selectAll('.body').on("mouseout",function() {
        div.style("display", "none");
        d3.selectAll('.body').style("fill","black");

    });

    d3.selectAll('.body').on("mousemove",function() {
        div.style("left", (d3.event.pageX +20) + "px")
            .style("top", (d3.event.pageY -20) + "px");
    });

    d3.selectAll('.body').on("click",function() {
        data = []
        circles = d3.selectAll(".body").selectAll("__data__")._parents;
        headsDim = []
        for (let i = 0; i < circles.length; i++) {
            headsDim.push(circles[i].__data__.v2)
            data.push(circles[i].__data__)
        }
        orderedHeadsDim = headsDim.sort(d3.ascending)
        indexFromTo = []
        for (let i = 0; i < orderedHeadsDim.length; i++) {
            for (let j = 0; j < data.length; j++){
                if(data[i].v2===orderedHeadsDim[j]) {
                    indexFromTo[i]=j;
                    orderedHeadsDim[j]=-1;
                    break;
                }
            }
        }
        for (let i = 0; i < indexFromTo.length; i++) {
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))/4  +","+Math.sign((-(i*100)+(indexFromTo[i]*100)))*50+")");
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500).delay(1500)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");

            // d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500)
            //     .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");

            d3.selectAll(".text").style("font-weight","normal");

            d3.selectAll("#group" + i).selectAll(".textV1").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 25 + ")");
            d3.selectAll("#group" + i).selectAll(".textV2").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + -25 + ")")
                .style("font-weight","bold");
            d3.selectAll("#group" + i).selectAll(".textV3").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 0 + ")");
            d3.selectAll("#group" + i).selectAll(".textV4").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 0 + ")");

            d3.selectAll("#grouplegend").selectAll(".textV1").transition().duration(3000)
                .attr("transform", "translate(0," + 25 + ")");
            d3.selectAll("#grouplegend").selectAll(".textV2").transition().duration(3000)
                .attr("transform", "translate(0," + -25 + ")")
                .style("font-weight","bold");
            d3.selectAll("#grouplegend").selectAll(".textV3").transition().duration(3000)
                .attr("transform", "translate(0," + 0 + ")");
            d3.selectAll("#grouplegend").selectAll(".textV4").transition().duration(3000)
                .attr("transform", "translate(0," + 0 + ")");
        }

    })

    /*
    * Funzioni per la lunghezza delle braccia
    */
    d3.selectAll('.arm').on("mouseover",function() {
        d3.selectAll('.arm').style("fill",mouseoverColor);

        div.text("Ordina per la lunghezza delle braccia")
            .style("display", "inline");
    });

    d3.selectAll('.arm').on("mouseout",function() {
        div.style("display", "none");
        d3.selectAll('.arm').style("fill","black");

    });

    d3.selectAll('.arm').on("mousemove",function() {
        div.style("left", (d3.event.pageX +20) + "px")
            .style("top", (d3.event.pageY -20) + "px");
    });

    d3.selectAll('.arm').on("click",function() {
        data = []
        circles = d3.selectAll(".armR").selectAll("__data__")._parents;
        headsDim = []
        for (let i = 0; i < circles.length; i++) {
            headsDim.push(circles[i].__data__.v3)
            data.push(circles[i].__data__)
        }
        orderedHeadsDim = headsDim.sort(d3.ascending)
        indexFromTo = []
        for (let i = 0; i < orderedHeadsDim.length; i++) {
            for (let j = 0; j < data.length; j++){
                if(data[i].v3===orderedHeadsDim[j]) {
                    indexFromTo[i]=j;
                    orderedHeadsDim[j]=-1;
                    break;
                }
            }
        }
        for (let i = 0; i < indexFromTo.length; i++) {
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))/4  +","+Math.sign((-(i*100)+(indexFromTo[i]*100)))*50+")");
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500).delay(1500)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");

            // d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500)
            //     .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");

            d3.selectAll(".text").style("font-weight","normal");

            d3.selectAll("#group" + i).selectAll(".textV1").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 25 + ")");
            d3.selectAll("#group" + i).selectAll(".textV2").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 25 + ")");
            d3.selectAll("#group" + i).selectAll(".textV3").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + -50 + ")")
                .style("font-weight","bold");
            d3.selectAll("#group" + i).selectAll(".textV4").transition().duration(3000)
                .attr("transform", "translate(" + (-(i * 100) + (indexFromTo[i] * 100)) + "," + 0 + ")");

            d3.selectAll("#grouplegend").selectAll(".textV1").transition().duration(3000)
                .attr("transform", "translate(0," + 25 + ")");
            d3.selectAll("#grouplegend").selectAll(".textV2").transition().duration(3000)
                .attr("transform", "translate(0," + 25 + ")");
            d3.selectAll("#grouplegend").selectAll(".textV3").transition().duration(3000)
                .attr("transform", "translate(0," + -50 + ")")
                .style("font-weight","bold");
            d3.selectAll("#grouplegend").selectAll(".textV4").transition().duration(3000)
                .attr("transform", "translate(0," + 0 + ")");
        }

    })

    /*
    * Funzioni per la lunghezza delle gambe
    */
    d3.selectAll('.leg').on("mouseover",function() {
        d3.selectAll('.leg').style("fill",mouseoverColor);

        div.text("Ordina per la lunghezza delle gambe")
            .style("display", "inline");
    });

    d3.selectAll('.leg').on("mouseout",function() {
        div.style("display", "none");
        d3.selectAll('.leg').style("fill","black");

    });

    d3.selectAll('.leg').on("mousemove",function() {
        div.style("left", (d3.event.pageX +20) + "px")
            .style("top", (d3.event.pageY -20) + "px");
    });

    d3.selectAll('.leg').on("click",function() {
        data = []
        circles = d3.selectAll(".legR").selectAll("__data__")._parents;
        headsDim = []
        for (let i = 0; i < circles.length; i++) {
            headsDim.push(circles[i].__data__.v4)
            data.push(circles[i].__data__)
        }
        orderedHeadsDim = headsDim.sort(d3.ascending)
        indexFromTo = []
        for (let i = 0; i < orderedHeadsDim.length; i++) {
            for (let j = 0; j < data.length; j++){
                if(data[i].v4===orderedHeadsDim[j]) {
                    indexFromTo[i]=j;
                    orderedHeadsDim[j]=-1;
                    break;
                }
            }
        }

        for (let i = 0; i < indexFromTo.length; i++) {
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))/4  +","+Math.sign((-(i*100)+(indexFromTo[i]*100)))*50+")");
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500).delay(1500)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");

            // d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(1500)
            //     .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");

            d3.selectAll(".text").style("font-weight","normal");

            d3.selectAll("#group"+i).selectAll(".textV1").transition().duration(3000)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +"," + 25 +")");
            d3.selectAll("#group"+i).selectAll(".textV2").transition().duration(3000)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +"," + 25 +")");
            d3.selectAll("#group"+i).selectAll(".textV3").transition().duration(3000)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +"," + 25 +")");
            d3.selectAll("#group"+i).selectAll(".textV4").transition().duration(3000)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +"," + -75 +")")
                .style("font-weight","bold");

            d3.selectAll("#grouplegend").selectAll(".textV1").transition().duration(3000)
                .attr("transform", "translate(0," + 25 + ")");
            d3.selectAll("#grouplegend").selectAll(".textV2").transition().duration(3000)
                .attr("transform", "translate(0," + 25 + ")");
            d3.selectAll("#grouplegend").selectAll(".textV3").transition().duration(3000)
                .attr("transform", "translate(0," + 25 + ")");
            d3.selectAll("#grouplegend").selectAll(".textV4").transition().duration(3000)
                .attr("transform", "translate(0," + -75 + ")")
                .style("font-weight","bold");
        }

    })

    /*
    * Funzione che mostra o nasconde i dati in base alla posizione.
    */
    d3.selectAll('.panelButton').on("click",function() {
        var transf = d3.select("#panel").attr("transform");
        if (transf!==null) {
            var splitted = transf.split(",");
            var y = ~~splitted [1].split(")")[0];
        } else y=0;
        if (y===0) {
            d3.selectAll('.panel').transition().duration(500)
                .attr("transform", "translate(0," + 135 + ")")
                .text("Hide Data");
        } else {
            d3.selectAll('.panel').transition().duration(500)
                .attr("transform", "translate(0," + 0 + ")")
                .text("Show data");
        }
    });

}

/*
* Funzione che crea e popola i gruppi contenenti gli elementi facenti parte dei singoli omini
*/
function drawSmallMen(data,i) {
    //appende all'svg un gruppo
    circleGroup = svg.append("g");

    /*
    * Costruisce tutte le figure facenti parte della silhouette dell'omino a partire da un punto
    *  passato come due coordinate dal file .json che rappresenta il punto in alto a sinistra del
    *  rettangolo che rappresenta il busto dell'omino
    */
    circleGroup.selectAll("smallMan.head").data(data).enter().append("circle")
        .attr("class", "smallMan head")
        .attr("cx",function (d) {return (d.x + (d.v2)/2)})
        .attr("cy",function (d) {return (d.y - d.v1)})
        .attr("r",function (d) {return d.v1});

    circleGroup.selectAll("smallMan.body").data(data).enter().append("rect")
        .attr("class", "smallMan body")
        .attr("x",function (d) {return d.x})
        .attr("y",function (d) {return d.y})
        .attr("width",function (d) {return (d.v2)})
        .attr("height",function (d) {return (d.v2*2)});

    circleGroup.selectAll("smallMan.armL").data(data).enter().append("rect")
        .attr("class", "smallMan arm armL")
        .attr("x",function (d) {return (d.x-d.v2/4)})
        .attr("y",function (d) {return d.y})
        .attr("width",function (d) {return (d.v2/4)})
        .attr("height",function (d) {return (d.v3)});
        // .attr("transform",function (d) { return "rotate(10," +  (d.x-d.v2/4) + "," + (d.y) +")"});

    circleGroup.selectAll("smallMan.armR").data(data).enter().append("rect")
        .attr("class", "smallMan arm armR")
        .attr("x",function (d) {return (d.x+d.v2)})
        .attr("y",function (d) {return d.y})
        .attr("width",function (d) {return (d.v2/4)})
        .attr("height",function (d) {return (d.v3)})
        // .attr("transform",function (d) { return "rotate(-10," +  (d.x+d.v2) + "," + d.y +")"});

    circleGroup.selectAll("smallMan.legL").data(data).enter().append("rect")
        .attr("class", "smallMan leg legL")
        .attr("x",function (d) {return (d.x)})
        .attr("y",function (d) {return (d.y+d.v2*2)})
        .attr("width",function (d) {return (d.v2/4)})
        .attr("height",function (d) {return (d.v4)});

    circleGroup.selectAll("smallMan.legR").data(data).enter().append("rect")
        .attr("class", "smallMan leg legR")
        .attr("x",function (d) {return (d.x+(d.v2*3)/4)})
        .attr("y",function (d) {return (d.y+d.v2*2)})
        .attr("width",function (d) {return (d.v2/4)})
        .attr("height",function (d) {return (d.v4)});

    circleGroup.selectAll("smallMan.text").data(data).enter().append("text")
        .attr("class", "text textV1")
        .attr("x",function (d) {return (d.x)})
        .attr("y",function (d) {return (d.y+200)})
        .text(function (d) {return ( d.v1)});

    circleGroup.selectAll("smallMan.text").data(data).enter().append("text")
        .attr("class", "text textV2")
        .attr("x",function (d) {return (d.x)})
        .attr("y",function (d) {return (d.y+225)})
        .text(function (d) {return ( d.v2)});

    circleGroup.selectAll("smallMan.text").data(data).enter().append("text")
        .attr("class", "text textV3")
        .attr("x",function (d) {return (d.x)})
        .attr("y",function (d) {return (d.y+250)})
        .text(function (d) {return ( d.v3)});

    circleGroup.selectAll("smallMan.text").data(data).enter().append("text")
        .attr("class", "text textV4")
        .attr("x",function (d) {return (d.x)})
        .attr("y",function (d) {return (d.y+275)})
        .text(function (d) {return ( d.v4)});

    circleGroup.attr("id","group"+i);
}

/*
* Funzione che crea e popola il gruppo contenente le etichette per i dati
*/
function drawLegend(){
    circleGroup = svg.append("g");

    circleGroup.append("text")
        .attr("class", "legendtext text textV1")
        .attr("x","0")
        .attr("y", "425")
        .text("HEAD");

    circleGroup.append("text")
        .attr("class", "legendtext text textV2")
        .attr("x","0")
        .attr("y", "450")
        .text("BODY");

    circleGroup.append("text")
        .attr("class", "legendtext text textV3")
        .attr("x","0")
        .attr("y", "475")
        .text("ARMS");

    circleGroup.append("text")
        .attr("class", "legendtext text textV4")
        .attr("x","0")
        .attr("y", "500")
        .text("LEGS");

    circleGroup.attr("id","grouplegend");
}

/*
* Funzione che crea e popola il gruppo contenente gli elementi del pannello che copre i dati
*/
function drawPanel(){
    circleGroup = svg.append("g");

    circleGroup.append("rect")
        .attr("class", "panel")
        .attr("id", "coverpanel")
        .attr("x","0")
        .attr("y","375")
        .attr("width","1100")
        .attr("height","300")

    circleGroup.append("rect")
        .attr("class", "panel panelButton")
        .attr("x","0")
        .attr("y","375")
        .attr("rx","5")
        .attr("ry","5")
        .attr("width","100")
        .attr("height","30");

    circleGroup.append("text")
        .attr("class", "panel panelButton panelButtonText")
        .attr("id", "panel")
        .attr("x","8")
        .attr("y","395")
        .text("Show data");

    circleGroup.attr("id","grouppanel");
}

/*
* Funzione che ricarica la pagina per poter ricominciare dalla situazione iniziale descritta dal
* file .json
*/
function restart() {
   location.reload();
}

/*
* Funzione che apre la pagina html della versione base
*/
function baseVersion() {
    location = "baseVersion.html";
}