function updateSeedList(){    
    var seedpapers = Papers.filter(function(p){return p.seed});
    var paperbox = d3.select('#seed-paper-container').selectAll('.outer-paper-box')
                    .data(seedpapers,function(d){return d.ID})

    paperbox.exit().remove()

    oldpapers = d3.select('#seed-paper-container').selectAll('.outer-paper-box').select('.inner-paper-box')
    oldpapers.select('.paper-title').html(function(p){
        return(p.Title)
    })
    oldpapers.select('.metric').html(function(p){
        return(p[metric]?p[metric]:'0')
    })
    oldpapers.select('.author-year').html(function(p){
        if(p.Author) {return p.Author+' '+p.Year}else{return(p.Year)}
    })
    oldpapers.select('.doi-link').html(function(p){
        return("<a target='_blank' href='https://doi.org/"+p.DOI+"'>"+p.DOI+"</a>")
    })

    paperbox = paperbox.enter()
        .append('div')
        .attr('class','outer-paper-box panel')
    paperbox.append('button').attr('class','delete-seed')
        .html('<i class="fa fa-times" color="red" aria-hidden="true"></i>')
        .on('click',function(p){deleteSeed(p)})
    paperbox = paperbox.append('div')
        .attr('class','inner-paper-box panel')
        .on('click',forceGraph.highlightNode)
    paperbox.append('p').attr('class','paper-title')
        .html(function(p){
            return(p.Title)
        })
    paperbox.append('p').attr('class','author-year')
        .html(function(p){
            if(p.Author) {return p.Author+' '+p.Year}else{return(p.Year)}
        })
    paperbox.append('p').attr('class','doi-link')
        .html(function(p){
            return("<a target='_blank' href='https://doi.org/"+p.DOI+"'>"+p.DOI+"</a>")
        })
};

function updateConnectedList(metric){
    
    var nonSeeds = Papers.filter(function(p){return(!p.seed)})
    paperbox = d3.select('#connected-paper-container').selectAll('tr')
                     .data(nonSeeds,function(d){return d.ID});
                     //.sort((a,b)=>b.seedsCitedBy<a.seedsCitedBy)
    paperbox.exit().remove();
    papers = d3.select('#connected-paper-container').selectAll('tr').select('td').select('.inner-paper-box')
    papers.select('.paper-title').html(function(p){
        return(p.Title)
    })
    papers.select('.metric').html(function(p){
        return(p[metric]?p[metric]:'0')
    })
    papers.select('.author-year').html(function(p){
        if(p.Author) {return p.Author+' '+p.Year}else{return(p.Year)}
    })
    papers.select('.doi-link').html(function(p){
        return("<a target='_blank' href='https://doi.org/"+p.DOI+"'>"+p.DOI+"</a>")
    })
}

function printConnectedList(metric,pageNum,replot){
    let pageSize = 100;
    let nonSeeds = Papers.filter(function(p){return(!p.seed)}).sort((a,b)=>b[metric]-a[metric]).slice(0,pageNum*pageSize)
    //Select all non-seeds and sort by metric.
    //Clear old table
    if(replot){
        d3.select('#connected-paper-container').selectAll('.outer-paper-box').remove();
    }
    let paperboxes = d3.select('#connected-paper-container').selectAll('.outer-paper-box')
                     .data(nonSeeds,function(d){return d.ID});
                     //.sort((a,b)=>b.seedsCitedBy<a.seedsCitedBy)
    paperboxes.exit().remove();

    oldpapers = d3.select('#connected-paper-container').selectAll('.outer-paper-box').select('.inner-paper-box')
    oldpapers.select('.paper-title').html(function(p){
        return(p.Title)
    })
    oldpapers.select('.metric').html(function(p){
        return(p[metric]?p[metric]:'0')
    })
    oldpapers.select('.author-year').html(function(p){
        if(p.Author) {return p.Author+' '+p.Year}else{return(p.Year)}
    })
    oldpapers.select('.doi-link').html(function(p){
        return("<a target='_blank' href='https://doi.org/"+p.DOI+"'>"+p.DOI+"</a>")
    })
    newpapers = paperboxes.enter()
        .append('div')
        .attr('class','outer-paper-box panel')
    newpapers.append('button').attr('class','delete-seed')
        .html('<i class="fa fa-plus" color="green" aria-hidden="true"></i>')
        .on('click',function(p){
            triggerEvent('newSeed',p)
        })
    newpapers = newpapers.append('div')
        .attr('class','inner-paper-box panel')
        .on('click',forceGraph.highlightNode)
    newpapers.append('p').attr('class','paper-title')
        .html(function(p){
            return(p.Title)
        })
    newpapers.append('p').attr('class','metric')
        .html(function(p){
            return(p[metric]?p[metric]:'')
        })
    newpapers.append('p').attr('class','author-year')
        .html(function(p){
            if(p.Author) {return p.Author+' '+p.Year}else{return(p.Year)}
        })
    newpapers.append('p').attr('class','doi-link')
        .html(function(p){
            return("<a target='_blank' href='https://doi.org/"+p.DOI+"'>"+p.DOI+"</a>")
        })

    d3.select('#more-button').remove();
    d3.select('#connected-paper-container').append('div')
        .html('<button id="more-button" class = "button1">more...</button>')
        .attr('onclick','printConnectedList("'+metric+'",'+(pageNum+1)+')')

        console.log('print called')
   
}