module.exports = {
    development: {
        root: require('path').normalize(__dirname + '/..'),
        host: "127.0.0.1",
        port: "80",
        db_prefix: "mongodb",
        db_host: "10.55.0.79",
        db_port: "27017",
        db_database: "eat-local"
    },

    localhost: {
        root: require('path').normalize(__dirname + '/..'),
        host: "127.0.0.1",
        port: "80",
        db_prefix: "mongodb",
        db_host: "127.0.0.1",
        db_port: "27017",
        db_database: "eat-local"
    }
};