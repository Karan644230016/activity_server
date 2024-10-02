import db from "../db.js";

export const actByStatus = (req, res) => {
  const sql = `
        SELECT 
    a.*, 
    t.*, 
    s.*, 
    COUNT(p.std_ID) AS act_numStdReserve
FROM
    activity a
LEFT JOIN teacher t ON a.t_ID = t.t_ID
LEFT JOIN section s ON t.t_ID = s.t_ID
LEFT JOIN participate p ON a.act_ID = p.act_ID -- Assuming 'participate' table for counting reserved students
WHERE
    a.act_status = 'เปิดลงทะเบียน'
    GROUP BY 
    a.act_ID, t.t_ID;



    `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "An error occurred while fetching data",
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "Data not found",
      });
    }
    return res.json(result);
  });
};

export const par = (req, res) => {
  const sql = `
        SELECT 
            p.*,st.*,s.*
        FROM
            participate p
        LEFT JOIN student st ON p.std_ID = st.std_ID
        LEFT JOIN section s ON st.sec_ID = s.sec_ID
    `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "An error occurred while fetching data",
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "Data not found",
      });
    }
    return res.json(result);
  });
};
