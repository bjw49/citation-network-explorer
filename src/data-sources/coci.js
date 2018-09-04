import {eventResponse,triggerEvent,addPaper,addEdge} from 'core'

eventResponse(true,'newSeed',function(papers){
    /*  let url = 'https://w3id.org/oc/index/coci/api/v1/references/'+paper.doi
     fetch(url).then(resp=>resp.json()).then(data => {
         coci.parseResponse(data,paper);
     }) */
     papers.forEach(paper=>{
        console.log('Querying COCI for '+paper.doi)
        let url = 'https://w3id.org/oc/index/coci/api/v1/citations/'+paper.doi
        fetch(url, {headers: {
            'Accept': 'application/sparql-results+json'
        }}).then(resp=>resp.json()).then(data => {
           parseResponse(data,paper);
           triggerEvent('newEdges')
        })
     })
})

function parseResponse(response, paper){
    let ne = 0; //For bean counting only
    let cited = paper;
    let newpapers = [];
    for(let i=0;i<response.length;i++){
        let citer = {
            doi: response[i].citing
        };
        newpapers.push(citer);
        let newEdge = {
            source: citer,
            target: cited,
            coci: true,
            hide: false
        }
        addEdge(newEdge);
        ne++;//bean counting
    }; 
    addPapers(newpapers)  
    console.log('COCI found ' + ne + " citations")
    return(cited)
}