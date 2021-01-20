module.exports = {
    "service_name": "ProfileService",
    "main-app-name": "rebateMango",
    "mysql-config": {
        "host": process.env.DB_HOST,
        "name": process.env.DB_NAME,
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "port": process.env.DB_PORT,
        "logging": process.env.NODE_ENV !== 'production'
    },
    "redis-config": {
        "security": {"host": process.env.SECURITY_REDIS_HOST, "port": process.env.SECURITY_REDIS_PORT}
    },
    "api-config": {
        "port": process.env.API_PORT,
        "jwt_life_time": "30m"
    },
    "facebook": {
        "graph_api": "https://graph.facebook.com"
    },
    "security": {
        "private_key": "xC3T@A58!sGC2#Bd"
    },
    "service-urls": {
        "segment_service" : process.env.SEGMENT_SERVICE_URL,
        "history_service" : process.env.HISTORY_SERVICE_URL,
        "notification_service": process.env.NOTIFICATION_SERVICE_URL,
        "static_service": process.env.STATIC_SERVICE_URL
    },
    "timezone": "+00:00"
};