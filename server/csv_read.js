const fs = require('fs');
const { parse } = require('csv-parse');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env'});

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
  connectionLimit: 10,
  supportBigNumbers: true,
  bigNumberStrings: true,
});

async function checkCharset() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SHOW VARIABLES LIKE "character_set_%"');
    console.log(rows);
    const [collationRows] = await connection.query('SHOW VARIABLES LIKE "collation_%"');
    console.log(collationRows);
  } finally {
    connection.release();
  }
}

async function insertBatch(rows) {
  const connection = await pool.getConnection();
  try {
    await connection.query("SET NAMES utf8mb4");
    await connection.query("SET CHARACTER SET utf8mb4");
    await connection.query("SET SESSION collation_connection = 'utf8mb4_unicode_ci'");

    for (const row of rows) {
      const [용도, 허가번호, , 품목명, 성분명, , 허가일, 업체명] = row;
      console.log('Inserting:', { 용도, 허가번호, 품목명, 성분명, 허가일, 업체명 }); // 로깅 추가
      await connection.execute(
        `INSERT INTO Medications (createdAt, updatedAt, 허가번호, 용도, 품목명, 성분명, 허가일, 업체명, 사용방법, 사용주기, 부작용) 
        VALUES (NOW(), NOW(), ?, ?, ?, ?, ?, ?, NULL, NULL, NULL)`,
        [허가번호, 용도, 품목명, 성분명, new Date(허가일), 업체명]
      );
    }
    
    await connection.commit();
    console.log(`Inserted ${rows.length} rows`);
  } catch (error) {
    await connection.rollback();
    console.error('Error inserting batch:', error);
  } finally {
    connection.release();
  }
}

async function processCSV() {
  const batchSize = 100;
  let batch = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream('농림축산식품부 농림축산검역본부_동물의약품 허가결과정보_20190930.csv', { encoding: 'utf8' })
      .pipe(parse({ 
        delimiter: ',', 
        from_line: 2, 
        ltrim: true, 
        rtrim: true,
        encoding: 'utf8'
      }))
      .on('data', (row) => {
        batch.push(row);
        if (batch.length >= batchSize) {
          insertBatch(batch);
          batch = [];
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          await insertBatch(batch);
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (error) => {
        console.error('Error processing CSV:', error);
        reject(error);
      });
  });
}

async function main() {
  try {
    await checkCharset();
    await processCSV();
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    pool.end();
  }
}

main();

setInterval(async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
  } finally {
    connection.release();
  }
}, 60000); // 1분마다 실행