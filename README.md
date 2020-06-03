# Di_Nardo_INFOVIS_1

## Primo Progetto del corso di INFOVIS

Crea un file json con dei dati multivariati: ci sono 10 data-point e ogni data-point ha quattro variabili quantitative i cui valori sono tutti positivi.
 In base a questi dati disegna 10 omini nell'area di disegno (è sufficiente la silhouette, ogni omino corrisponde ad un data-point).
 La prima variabile determina la lunghezza delle gambe degli omini, la seconda variabile la lunghezza delle braccia, la terza variabile la dimensione della testa, e così via.
 Facendo click con il pulsante sinistro su una caratteristica di un omino, tutti gli omini si dispongono in orizzontale nell'ordine corrispondente al loro ordinamento in base alla variabile associata alla caratteristica cliccata. Fai in modo che i cambi di posizione degli omini avvengano con un'animazione fluida.

## Note

Ho deciso di adottare le seguenti caratteristiche come variabili per i dati multivariati del file .json:
- Grandezza della testa (v1)
- Larghezza del busto (v2)
- Lunghezza delle braccia (v3)
- Lunghezza delle gambe (v4)

Ho aggiunto inoltre 2 variabili che fanno da coordinate per il punto in alto a sinistra del rettangolo che rappresenta il busto, questo punto funge da perno per posizionare tutti gli altri elementi che costituiscono l'omino.
Variabili aggiunte:
- Ascissa del punto (x)
- Ordinata del punto (y)

Ho deciso di spendere un po' di tempo in più creando una versione "avanzata" rispetto al progetto base per cercare di comprendere meglio potenzialità e/o limitazioni di D3.js:
- Ho tenuto sia la versione base che quella "avanzata", tra le quali si può passare facilmente grazie a un bottone in alto a sinistra.
- Ho aggiunto un bottone per ricaricare la pagina al fine di riportare la situazione degli omini allo stato iniziale
- Ho aggiunto una "sezione dati", ovvero una sezione dove è presente una sorta di rappresentazione tabellare che può essere mostrata o nascosta tramite un rettangolo riadattato a bottone.
- La "sezione dati" mostra i valori degli omini accostandogli una legenda, i dati verranno poi riorganizzati ed evidenziati in base alla carattertistica sulla quale si vuole riordinare gli omini.
- Ho ridondato il file .json tramite un collegamento a GitHub Gist (https://gist.githubusercontent.com/DarioDN/fd26f6b5b789e8af5ff832697aa61b6d/raw/4a4979875531375eae7809018733a2f118f823d6/smallMenDataset.json) attraverso il quale è possibile lanciare lo script senza aver bisogno di un webserver necessario a superare le protezioni del browser sul caricamento dei file locali (testato su Chrome versione 83.0.4103.61)

## Considerazioni personali 

Ho apprezzato moltissimo lo strumento di selezione di D3.js, il quale è uno strumento potentissimo per la modellazione degli elementi del DOM.

D'altro canto l'svg ha determinate limitazioni, ad esempio da quanto sono riuscito a capire, non è possibile modellare determinati elementi al suo interno come bottoni e tabelle, per aggirare il problema è sempre possibile inserire queste componenti come elementi esterni all'svg ma così facendo si perde la possibilità di accoppiarli con le informazioni dell'svg e poterli modellare come gruppo.
