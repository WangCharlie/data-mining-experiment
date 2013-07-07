function DBSCAN (D, eps, MinPts) {
    this.D = D;           // array of data points
    this.dist = dbscanDist;     // distance function(i1, i2) given indices of two data points
    this.eps = eps;       // neighborhood radius
    this.MinPts = MinPts; // minimum number of points to form cluster
    this.assigned = [];   // cluster assignment 0-n for each point; -1 --> noise
                          // if an element is undefined we have not yet visited the point
    this.cluster = [];    // array of clusters, each an array of point indices
    // Note that we store cluster assignments redundantly in this.assigned and this.cluster
    // to quickly determine which points are in a cluster and which cluster a point is in.
    // Always update both arrays!
    this.run = dbscanRun;  // run the analysis, optionally with new eps, MinPts values
    this.getNeighbors = dbscanGetNeighbors;   // private
    this.expandCluster = dbscanExpandCluster; // private
}

function dbscanRun(eps, MinPts) {
    if (eps) this.eps = eps;
    if (MinPts) this.MinPts = MinPts;
    this.assigned = new Array(D.length);
    this.cluster = new Array();
    for (var P in this.D) {
        if (this.assigned[P] !== undefined) continue;  // already visited
        console.log('visiting ' + P);
        var N = this.getNeighbors(P);
        console.log('neighbors: ' + N);
        if (N.length + 1 < this.MinPts) {
            this.assigned[P] = -1; // noise
            console.log('noise');
        }
        else {
            var C = this.cluster.length; // next cluster index
            this.cluster[C] = [];  // new cluster
            console.log('cluster ' + C);
            this.expandCluster(P, N, C);
        }
    }
}

function dbscanGetNeighbors(P) {
    var neighbors = [];
    for (var i in this.D) {
        if (i == P) continue;
        if (this.dist(P, i) <= this.eps)
            neighbors.push(i);
    }
    return neighbors;
}

function dbscanExpandCluster(P, N, C) {
    this.cluster[C].push(P);
    this.assigned[P] = C;
    for (var PP = 0; PP < N.length; PP++) {  // PP is P' -- note P' is indexing N, not D
        console.log('> ' + N[PP]);
        if (this.assigned[N[PP]] === undefined) {  // P' not yet visited?
            console.log('> visiting');
            var NP = this.getNeighbors(N[PP]);  // NP is N'
            console.log('> neighbors: ' + NP);
            if (NP.length >= this.MinPts) {
                N = N.concat(NP.filter(function(vNew) {return this.every(function(vOld) {return vOld != vNew})}, N));
                console.log('expanded neighborhood: ' + N);
            }
        }
        if (!(this.assigned[PP] > -1)) {  // P' not yet assigned to a cluster?
            this.cluster[C].push(PP);
            this.assigned[PP] = C;
        }
    }
}

function dbscanDist(p1, p2) {
    var dist = 0;
    for (var i = 0; i < p1.length; i++) {
        dist += Math.pow(Math.abs(p1[i] -p2[i]), 2);
    }

    return Math.sqrt(dist);
}