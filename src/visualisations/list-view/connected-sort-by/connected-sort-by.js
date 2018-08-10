
document.getElementById('connected-sort-by').style.display = 'none'
document.getElementById('connected-sort-by').getElementsByTagName('select')[0].onchange = function(){
    let metric = this.value;
    papers = d3.select('#connected-paper-container').selectAll('.outer-paper-box').select('.inner-paper-box')
    papers.select('.metric').html(function(p){
        return(p[metric]?p[metric]:'0')
    })
    connectedList.print(metric,1,true)    
}