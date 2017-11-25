const elasticsearch = require("elasticsearch");

var client = new elasticsearch.Client({
    host:
        "search-fivetum-junction2017-ffvhs3t2abeelwsdpqgyzwxxqa.us-east-2.es.amazonaws.com",
    log: "trace"
});

var callClient = function (query) {
    return client
        .search(query)
        .then(
            function(resp) {
                var hits = resp.hits.hits;
                console.log("resp", hits);
            },
            function(err) {
                console.trace(err.message);
            }
        );
};

var searchByQueryString = function(queryString) {
    return callClient({
        index: "locations",
        type: "location",
        body: {
            query: {
                bool: {
                    must: {
                        query_string: {
                            query: queryString
                        }
                    }
                }
            }
        }
    });
};

var searchAggregatedResults = function(start, end, interval) {
    return callClient({
        index: "readingstwo",
        type: "reading",
        body: {
            query: {
                bool: {
                    filter: {
                        range: {
                            timestamp: {
                                gte: start,
                                lte: end,
                                format: 'yyyy-MM-dd'
                            }
                        }
                    }
                }
            },
            aggs: {
                power_over_time: {
                    date_histogram: {
                        field: 'timestamp',
                        interval: interval,
                        format: 'yyyy-MM-dd HH:mm:ss'
                    },
                    aggs: {
                        stats: {
                            stats: {
                                field: 'power'
                            }
                        }
                    }
                }
            },
            size: 0
        }
    });
};

module.exports = {
    searchByQueryString: searchByQueryString,
    searchAggregatedResults: searchAggregatedResults
};