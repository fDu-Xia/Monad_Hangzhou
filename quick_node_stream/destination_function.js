const mysql = require('mysql2/promise');

// MySQL数据库配置
const DB_CONFIG = {
    HOST: 'nj-cdb-686m7tin.sql.tencentcdb.com',
    PORT: 27371,
    USER: 'root',
    PASSWORD: 'xiadezhi666',
    DATABASE: 'trustornic',
    // 连接池配置
    CONNECTION_LIMIT: 10,
    ACQUIRE_TIMEOUT: 60000,
    TIMEOUT: 60000
};

// 全局连接池
let connectionPool = null;


async function initializeDatabase() {
    if (connectionPool) {
        return connectionPool;
    }

    try {
        connectionPool = mysql.createPool({
            host: DB_CONFIG.HOST,
            port: DB_CONFIG.PORT,
            user: DB_CONFIG.USER,
            password: DB_CONFIG.PASSWORD,
            database: DB_CONFIG.DATABASE,
            waitForConnections: true,
            connectionLimit: DB_CONFIG.CONNECTION_LIMIT,
            queueLimit: 0,
            acquireTimeout: DB_CONFIG.ACQUIRE_TIMEOUT,
            timeout: DB_CONFIG.TIMEOUT,
            reconnect: true,
            handleDisconnects: true
        });

        // 测试连接
        const connection = await connectionPool.getConnection();
        await connection.ping();
        connection.release();

        console.log('Successfully connected to MySQL database');
        return connectionPool;
    } catch (error) {
        console.error('Failed to initialize MySQL connection pool:', error);
        connectionPool = null;
        throw error;
    }
}

async function insertPoints(pool, points) {
    if (points.length === 0) {
        return;
    }

    // 执行批量插入
    for (let i = 0; i < points.length; i++) {
        const [address, type, platform, point] = points[i];

        // 规范化数据
        const normalizedAddress = address.toLowerCase();
        const normalizedPlatform = platform.toLowerCase();
        const tableName = type.toLowerCase();
        const normalizedPoint = parseInt(point);

        // 构建SQL语句 - 使用ON DUPLICATE KEY UPDATE来处理重复数据
        const sql = `
            INSERT INTO ${tableName} (address, platform, point) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            point = point + VALUES(point),
            updated_at = CURRENT_TIMESTAMP
        `;

        try {
            // 执行插入
            await pool.execute(sql, [normalizedAddress, normalizedPlatform, normalizedPoint]);
            console.log(`Inserted into ${tableName}: ${normalizedAddress}, ${normalizedPlatform}, ${normalizedPoint}`);
        } catch (error) {
            console.error(`Error inserting into ${tableName}:`, error);
        }
    }
}


async function main(params) {
    const startTime = Date.now();

    try {
        // 初始化数据库连接
        const pool = await initializeDatabase();

        // 提取数据
        const { points } = params;

        // 批量插入数据
        await insertPoints(pool, points);

        const processingTime = Date.now() - startTime;



        return {
            status: 'success',
            message: `Successfully processed ${points.length} point records`,
            timestamp: new Date().toISOString(),
            processing_time_ms: processingTime,
            data: {
                total_points: points.length,
            }
        };

    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error('Error processing point data:', {
            error: error.message,
            stack: error.stack,
            processing_time_ms: processingTime
        });

        return {
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString(),
            processing_time_ms: processingTime,
            data: {
                error_type: error.constructor.name,
                points_attempted: params?.points?.length || 0
            }
        };
    }
}

module.exports = { main };