
newDataModule('coci', {

    eventResponses:{
        newSeed: function(paper){
           /*  let url = 'https://w3id.org/oc/index/coci/api/v1/references/'+paper.DOI
            fetch(url).then(resp=>resp.json()).then(data => {
                coci.parseResponse(data,paper);
            }) */
            console.log('Querying COCI for '+paper.DOI)
            let url = 'http://opencitations.net/index/coci/api/v1/citations/'+paper.DOI
            fetch(url, {headers: {
                'Accept': 'application/sparql-results+json'
            }}).then(resp=>resp.json()).then(data => {
                coci.parseResponse(data,paper);
                refreshGraphics();
            })
        },
    },
    parseResponse: function(response,paper){
        let ne = 0; //For bean counting only
        let cited = paper;

        for(let i=0, citation = response[i];i<response.length;i++){

            let citer = {
                DOI: citation.citing
            };

            citer = addPaper(citer);

            let newEdge = {
                source: citer,
                target: cited,
                coci: true,
                hide: false
            }
            addEdge(newEdge);
            ne++;//bean counting
        };   
        console.log('COCI found ' + ne + " citations")
        return(cited)
    }
}) 