
var minconnections = 0,

    mode = 'citedBy',

    selectednode,

    graph = {},

    osvg = d3.select('#forceGraph'), //select the svg
    
    width = +osvg.attr("width"), //extract the width and height attribute (the + converts to number)

    height = +osvg.attr("height"),

    svg = osvg.append('g'),

    link = svg.append("g").attr("class", "link").selectAll("line"),

    node = svg.append("g").attr("class", "node").selectAll("circle"),

    color = d3.scaleOrdinal(d3.schemeCategory20),
    
    simulation = d3.forceSimulation()
                    .force("link", d3.forceLink().id(function(d) { return d.ID; }))
                    .force("charge", d3.forceManyBody().strength(-100))
                    .force("center", d3.forceCenter(width / 2, height / 2))
                    .force("xattract",d3.forceX())
                    .force("yattract",d3.forceY()); 

    osvg.call(d3.zoom().on("zoom", function () {svg.attr("transform", d3.event.transform)}))
    .on("dblclick.zoom", null);


function updateGraph(Papers,Edges){

    //Pick only edges that you want to display i.e. citedBy vs References

    switch(mode){
        
                case 'ref':
        
                graph.links = Edges.filter(function(e){return(e.source.seed)}).map(function(e){return {source: e.source.ID, target: e.target.ID}});
                
                var sizeMetric = 'seedsCitedBy';

                break;

                case 'citedBy':
        
                graph.links = Edges.filter(function(e){return(e.target.seed)}).map(function(e){return {source: e.source.ID, target: e.target.ID}});
                
                var sizeMetric = 'seedsCited';
                
                break;
    }

    //Pick only Papers that are connected to something

    graph.nodes = Papers.filter(function(p){
        
        
                var ids = graph.links.map(function(e){return(e.source)}).concat(graph.links.map(function(e){return(e.target)}));
        
                return(ids.includes(p.ID))
        
            }); 

    node = node.data(graph.nodes,function(d){return d.ID});

    node.exit().remove();
            
    node = node.enter().append("circle")
                        .merge(node)
                        .attr("r", function(d){return d.seed ? 7 : 5 + d[sizeMetric]})
                        .attr("fill", function(d) { return color(d.seed); })
                        .style("visibility", function (d) {return d.hide == 1 ? "hidden" : "visible";})
                        .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended))
                        .on("dblclick",hideSingles)
                        .on("click",highlightNode)
                        
                        
    node.append("title")
        .text(function(d) { return d.Title; }); //Label nodes with Title on hover

    link = link.data(graph.links, function(d) { return d.source.ID + "-" + d.target.ID; })

    link.exit().remove();

    link = link.enter().append("line")
                .merge(link);

    // Update and restart the simulation.
    simulation.nodes(graph.nodes).on("tick", ticked);
    simulation.force("link").links(graph.links);
    simulation.alpha(1).restart();

    threshold(minconnections)
    //center_view();

}   


//Functions for implementing the animation on drag
function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}



function hideSingles(){

    
        var nodeid = this.__data__.ID;

        childrenids = findUniqueChildren(nodeid);

        Papers.filter(function(p){return childrenids.includes(p.ID)}).forEach(function(p){p.hide= !p.hide;});

        Edges.filter(function(e){
        
                    var hiddenPapers = Papers.filter(function(p){return p.hide}).map(function(p){return p.ID});
    
                    return hiddenPapers.includes(e.source.ID) | hiddenPapers.includes(e.target.ID);
    
                }).forEach(function(e){e.hide=true})

        node.style("visibility", function (p) {
            return p.hide ? "hidden" : "visible" ;
        });
        link.style("visibility", function(e){
            
                     var hiddenPapers = Papers.filter(function(p){return p.hide}).map(function(p){return p.ID});
    
                    return hiddenPapers.includes(e.source.ID) | hiddenPapers.includes(e.target.ID) ? "hidden":"visible";})
        
        //updateGraph(Papers,Edges);

}

function updateInfoBox(selected){

        p = selected.__data__;

        d3.select('#info-title').html('<h4>'+p.Title+'</h4>');
        d3.select('#info-year').html('<b>Year: </b> '+p.Year);
        d3.select('#info-doi').html('<b>DOI: </b> <a href="https://doi.org/'+p.DOI+'">'+p.DOI+'</a>');

        selectednode = p;
}

function highlightNode(){

    updateInfoBox(this);

}

function ticked() {

            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
    }



function threshold(value){

        Papers.forEach(function(p){p.hide=false});
        Papers.filter(function(p){return !(p.citedBy>=value || p.seed)}).forEach(function(p){p.hide=true;}); 

        node.style("visibility", function (p) {
            return p.hide ? "hidden" : "visible" ;
        });

        link.style("visibility", function(e){
            
            var hiddenPapers = Papers.filter(function(p){return p.hide}).map(function(p){return p.ID});

            return hiddenPapers.includes(e.source.ID) | hiddenPapers.includes(e.target.ID) ? "hidden":"visible";
        
        })

}
  