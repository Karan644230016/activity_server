import db from "../db.js";

export const getMailbox = (req, res) => {
  const { login_ID } = req.query;

  const sql = `
        SELECT * FROM 
            notify n
        JOIN
            notification noti ON noti.noti_ID = n.noti_ID
        WHERE login_ID = ?
    `;

  db.query(sql, [login_ID], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json(result);
  });
};

export const getOne = (req, res) => {
  const { id } = req.body;
  const sql = `
            SELECT * FROM news `;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json(result);
  });
};
export const update = (req, res) => {
  const { news_topic, news_desc, news_date, news_create, act_title, key } =
    req.body;

  const sql = `
        UPDATE news SET
            news_topic = ?,
            news_desc = ?,
            news_date = ?,
            news_create = ?,
            act_title = ?
        WHERE act_title = ?;
    `;

  db.query(
    sql,
    [news_topic, news_desc, news_date, news_create, act_title, key],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }
      console.log("Update result:", result);
      return res.json(result);
    }
  );
};

export const updateAct_title = (req, res) => {
  const { act_title, newAct_title } = req.body;
  const sql = `
            UPDATE news SET
            act_title = ?
        WHERE act_title = ?
                `;
  db.query(sql, [newAct_title, act_title], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json(result);
  });
};
export const deleteNews = (req, res) => {
  const { act_title } = req.body;
  const sql = `
            DELETE FROM news WHERE news_ID = ?
                `;
  db.query(sql, [act_title], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json(result);
  });
};
export const post = (req, res) => {
  const { topic, description } = req.body;
  console.log(req.body);

  const sqlNotification = `
        INSERT INTO notification
            (topic, description)
        VALUES
            ( ? , ?)
        `;
  const sqlNotify = `
        INSERT INTO notify 
            (noti_ID,login_ID)
        SELECT 
            ?,login_ID
        FROM 
            login;
        `;

  db.beginTransaction((err) => {
    if (err) throw err;

    // First, insert the news
    db.query(sqlNotification, [topic, description], (error, results) => {
      if (error) {
        return db.rollback(() => {
          res.status(500).send("Error inserting news: " + error.message);
        });
      }

      const noti_ID = results.insertId;

      db.query(sqlNotify, [noti_ID], (error) => {
        if (error) {
          return db.rollback(() => {
            res
              .status(500)
              .send("Error inserting notifications: " + error.message);
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .send("Error committing transaction: " + err.message);
            });
          }
          res.status(200).send("News and notifications added successfully!");
        });
      });
    });
  });
};
export const newsCancelReserve = (req, res) => {
  const {
    topic,
    description,
    login_ID
  } = req.body;

  const sqlNotification = `
        INSERT INTO notification(topic, description)
        VALUES(?,?)
    `;

  const sqlNotify = `
    insert into notify(noti_ID, login_ID)
    values(?,?)
  `

  db.beginTransaction((err) => {
    if (err) throw err;

    // First, insert the news
    db.query(sqlNotification, [topic, description], (error, results) => {
      if (error) {
        return db.rollback(() => {
          res.status(500).send("Error inserting news: " + error.message);
        });
      }

      const noti_ID = results.insertId;

      db.query(sqlNotify, [noti_ID, login_ID], (error) => {
        if (error) {
          return db.rollback(() => {
            res
              .status(500)
              .send("Error inserting notifications: " + error.message);
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .send("Error committing transaction: " + err.message);
            });
          }
          res.status(200).send("News and notifications added successfully!");
        });
      });
    });
  });
};

export const upload = (req, res) => {
  const sqlNotification = `
    INSERT INTO 
      notification
        (topic, description)
    VALUES
      (?,?)
  `;

  const sqlNotify = `
    INSERT INTO
      notify
        (noti_ID, login_ID)
    VALUES
      (?,?)
  `;

  const { topic, description, login_ID } = req.body;
  console.log(req.body); // Make sure this logs the expected data

  if (!Array.isArray(login_ID)) {
    return res.status(400).send("login_ID should be an array");
  }

  db.beginTransaction((err) => {
    if (err) throw err;

    // First, insert the notification
    db.query(sqlNotification, [topic, description], (error, results) => {
      if (error) {
        return db.rollback(() => {
          res
            .status(500)
            .send("Error inserting notification: " + error.message);
        });
      }

      const noti_ID = results.insertId;

      // Insert into notify table for each login_ID
      const insertPromises = login_ID.map((id) => {
        return new Promise((resolve, reject) => {
          db.query(sqlNotify, [noti_ID, id], (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      });

      // Wait for all inserts to complete
      Promise.all(insertPromises)
        .then(() => {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res
                  .status(500)
                  .send("Error committing transaction: " + err.message);
              });
            }
            res.status(200).json({
              message: "Notification for student activity added successfully",
            });
          });
        })
        .catch((error) => {
          db.rollback(() => {
            res
              .status(500)
              .send("Error inserting notifications: " + error.message);
          });
        });
    });
  });
};

export const test = (req, res) => {
  const { news_topic, news_desc, news_date } = req.body;

  const newsInsertSql = `
        INSERT INTO news (news_topic, news_desc,  news_date)
        VALUES (?, ?, ?);
    `;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) throw err;

    // First, insert the news
    db.query(
      newsInsertSql,
      [news_topic, news_desc, news_date],
      (error, results) => {
        if (error) {
          return db.rollback(() => {
            res.status(500).send("Error inserting news: " + error.message);
          });
        }

        const newsId = results.insertId;

        const notifyInsertSql = `
                INSERT INTO notify (news_ID, notify_status, login_ID)
                SELECT ?, 'unread', login_ID
                FROM login;
            `;

        db.query(notifyInsertSql, [newsId], (error) => {
          if (error) {
            return db.rollback(() => {
              res
                .status(500)
                .send("Error inserting notifications: " + error.message);
            });
          }

          // Commit the transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res
                  .status(500)
                  .send("Error committing transaction: " + err.message);
              });
            }
            res.status(200).send("News and notifications added successfully!");
          });
        });
      }
    );
  });
};
export const newsOne = (req, res) => {
  const { news_topic, news_desc, news_date, login_ID } = req.body;

  const userIds = Array.isArray(login_ID) ? login_ID : [login_ID];

  const newsInsertSql = `
        INSERT INTO news (news_topic, news_desc, news_date)
        VALUES (?, ?, ?);
    `;

  db.beginTransaction((err) => {
    if (err) throw err;

    db.query(
      newsInsertSql,
      [news_topic, news_desc, news_date],
      (error, results) => {
        if (error) {
          return db.rollback(() => {
            res.status(500).send("Error inserting news: " + error.message);
          });
        }

        const newsId = results.insertId;

        const notifyInsertSql = `
                INSERT INTO notify (news_ID, notify_status, login_ID)
                VALUES (?, ?, ?);
            `;

        // Prepare an array of promises for the insertions
        const notifyPromises = userIds.map((userId) => {
          return new Promise((resolve, reject) => {
            db.query(notifyInsertSql, [newsId, "unread", userId], (error) => {
              if (error) {
                return reject(error);
              }
              resolve();
            });
          });
        });

        // Execute all insertions
        Promise.all(notifyPromises)
          .then(() => {
            // Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .send("Error committing transaction: " + err.message);
                });
              }
              res
                .status(200)
                .send("News and notifications added successfully!");
            });
          })
          .catch((error) => {
            return db.rollback(() => {
              res
                .status(500)
                .send("Error inserting notifications: " + error.message);
            });
          });
      }
    );
  });
};
