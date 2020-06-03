/*
* Inizializzazione e creazione degli elementi base dello script come bottoni, l'svg
*  e alcune variabili.
*/
buttonDiv = d3.select("body").append("div")
    .attr("id","buttonDiv");

buttonDiv.append("button")
    .attr("onclick","restart()")
    .text("Ricomincia");

buttonDiv.append("button")
    .attr("onclick","advancedVersion()")
    .text("Versione avanzata");

var margin = {top: 20, right: 20, bottom: 30, left: 40};

var width = 1100 - margin.left - margin.right;
var height = 1100 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

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
* Funzione pricipale che crea gli omini e assegna agli elementi le varie funzioni
* attivate dall'evento "click".
*/
function init(data){

    /*
    * Si chiama la funzione su ogni omino in maniera indipendente al fine di farlo appartenere
    *  a un unico gruppo e poter operare sulle proprietà del gruppo invece che della singola
    *  componente.
    */
    for(let i = 0; i<data.length; i++) {
        drawSmallMen(data[i],i);
    }

    /*
    * Sono presenti di seguito 1 funzione uguale per ogni elemento che rappresenta una delle 4 variabili
    * del file .json, ovvero:
    * -Grandezza della testa (v1)
    * -Larghezza del busto (v2)
    * -Lunghezza delle braccia (v3)
    * -Lunghezza delle gambe (v4)
    *
    *  commento solo la funzione relativa alla testa, poiché gli altri commenti sarebbero
    *  ridondati.
    */

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
            * sposta il singolo omino muovendolo in una singola fase.
            */
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(3000)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");
        }

    })

    /*
    * Funzione per la larghezza del busto
    */
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
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(3000)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");
        }

    })

    /*
    * Funzione per la lunghezza delle braccia
    */
    d3.selectAll('.arm').on("click",function() {
        data = []
        circles = d3.selectAll(".armR").selectAll("__data__")._parents;
        headsDim = []
        for (let i = 0; i < circles.length; i++) {
            headsDim.push(circles[i].__data__.v3)
            data.push(circles[i].__data__)
        }
        orderedHeadsDim = headsDim.sort(d3.ascending)
        console.log(orderedHeadsDim)
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
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(3000)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");
        }

    })

    /*
    * Funzioni per la lunghezza delle gambe
    */
    d3.selectAll('.leg').on("click",function() {
        data = []
        circles = d3.selectAll(".legR").selectAll("__data__")._parents;
        headsDim = []
        for (let i = 0; i < circles.length; i++) {
            headsDim.push(circles[i].__data__.v4)
            data.push(circles[i].__data__)
        }
        orderedHeadsDim = headsDim.sort(d3.ascending)
        console.log(orderedHeadsDim)
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
            d3.selectAll("#group"+i).selectAll(".smallMan").transition().duration(3000)
                .attr("transform", "translate("+ (-(i*100)+(indexFromTo[i]*100))  +",0)");
        }

    })

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

    circleGroup.selectAll("smallMan.armR").data(data).enter().append("rect")
        .attr("class", "smallMan arm armR")
        .attr("x",function (d) {return (d.x+d.v2)})
        .attr("y",function (d) {return d.y})
        .attr("width",function (d) {return (d.v2/4)})
        .attr("height",function (d) {return (d.v3)});

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

    circleGroup.attr("id","group"+i);
}

/*
* Funzione che ricarica la pagina per poter ricominciare dalla situazione iniziale descritta dal
* file .json
*/
function restart() {
    location.reload();
}

/*
* Funzione che apre la pagina html della versione "avanzata"
*/
function advancedVersion() {
    location = "index.html";
}