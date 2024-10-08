import db from "../db.js";

export const get = (req, res) => {
  const sql = `
        SELECT * FROM notify
        inner join news on news.news_ID = notify.news_ID
        where notify.login_ID = ?
        `;
  const { id } = req.query;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
};

export const read = (req, res) => {
  const { noti_ID, login_ID } = req.body;
  const sql = `update notify set noti_status = "อ่านแล้ว" where noti_ID = ? and login_ID = ?`;
  db.query(sql, [noti_ID, login_ID], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
};
