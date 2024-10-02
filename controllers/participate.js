import db from "../db.js";

// get only participate by act_ID

export const getByAct_ID = (req, res) => {
  const { act_ID } = req.query;
  const sql = `
        SELECT 
            p.*,s.*
        FROM 
            participate p 
        LEFT JOIN
            student s ON p.std_ID = s.std_ID
        WHERE act_ID = ?
    `;

  db.query(sql, [act_ID], (err, result) => {
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
// getAll
export const getByStd_ID = (req, res) => {
  const { std_ID } = req.query;
  const sql2 = `
SELECT 
    activity.act_ID,
    activity.t_ID,
    activity.act_title,
    activity.act_desc,
    activity.act_dateStart,
    activity.act_dateEnd,
    activity.act_numStd,
    activity.act_location,
    activity.act_status,
    activity.act_createAt,
    activity.act_transaction,
    participate.std_ID,
    participate.par_status,
    teacher.t_fname,
    teacher.t_lname,
    teacher.t_mobile,
    teacher.t_email,
    COALESCE(participate_count.numStdReserve, 0) AS numStdReserve
FROM
    activity
    LEFT JOIN participate ON activity.act_ID = participate.act_ID 
                          AND participate.std_ID = ?
    LEFT JOIN teacher ON activity.t_ID = teacher.t_ID
    LEFT JOIN (
        SELECT act_ID, COUNT(*) AS numStdReserve
        FROM participate
        GROUP BY act_ID
    ) AS participate_count ON activity.act_ID = participate_count.act_ID
ORDER BY activity.act_ID;

`;

  db.query(sql2, [std_ID], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
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
export const readManage = (req, res) => {
  const sql = `SELECT activity.*, manage.std_ID, teacher.*, student.*, section.*,login.login_ID as ids
    FROM activity
    LEFT JOIN manage ON activity.act_ID = manage.act_ID
    LEFT JOIN teacher ON activity.staff_ID = teacher.login_ID
    LEFT JOIN student ON manage.std_ID = student.std_ID
    LEFT JOIN section ON student.sec_ID = section.sec_ID
    left join login on student.login_ID = login.username
    WHERE activity.act_status = 1 AND activity.act_ID IS NOT NULL;
        `;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
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
export const readManageOne = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
        participate.*,
        activity.*,
        student.*,
        teacher.t_fname,
        teacher.t_lname,
        section.sec_name
    FROM participate 
        LEFT JOIN activity ON activity.act_ID = participate.act_ID 
        LEFT JOIN student ON student.std_ID = participate.std_ID
        LEFT JOIN teacher ON teacher.t_ID = activity.t_ID
        LEFT JOIN section ON section.sec_ID = student.sec_ID
    WHERE 
        participate.act_ID = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
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
export const updateStatus = (req, res) => {
  let { par_status, std_ID, act_ID } = req.body;

  // Ensure std_ID is an array
  if (!Array.isArray(std_ID)) {
    std_ID = [std_ID];
  }

  const sql1 = `
    UPDATE participate 
    SET par_status = ?
    WHERE act_ID = ? AND std_ID IN (?)
  `;

  db.query(sql1, [par_status, act_ID, std_ID], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({
        error: err.message,
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
    });
  });
};




// reserve
export const reserveActivity = (req, res) => {
  const sql = `
        INSERT INTO participate 
            ( std_ID, act_ID) 
        VALUES 
            ( ?, ?)
        `;
  const { std_ID, act_ID } = req.body;

  db.query(sql, [std_ID, act_ID], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Reserve successfully");
  });
};

// cancel reserve
export const cancelReserve = (req, res) => {
  const sql = `DELETE FROM participate WHERE std_ID = ? AND act_ID = ?`;
  const { std_ID, act_ID } = req.body;

  db.query(sql, [std_ID, act_ID], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Deleted Reserve successfully");
  });
};

// after cancer reserve then decrease numStd in activity
export const decreaseNumStd = (req, res) => {
  const sql = `UPDATE activity SET act_numStdReserve = act_numStdReserve - ? WHERE act_ID = ?`;
  const { act_ID, cancelReserveNumStd } = req.body;
  db.query(sql, [cancelReserveNumStd, act_ID], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Decreased numStd in activty successfully");
  });
};

export const upload = (req, res) => {
  const q = `
        SELECT activity.*, manage.std_ID, student.std_fname, student.std_lname
        FROM activity 
        JOIN manage ON activity.act_ID = manage.act_ID
        JOIN student ON manage.std_ID = student.std_ID
    `;

  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
};

export const countNumStdReserve = (req, res) => {
  const sql = `
    SELECT COUNT(*) AS numStdReserve
    FROM participate
    WHERE act_ID = ?;
  `;

  const { act_ID } = req.params;

  db.query(sql, [act_ID], (error, result) => {
    if (error) return res.status(500).json(err);
    return res.status(200).json(result);
  });
};
