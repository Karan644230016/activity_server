import db from '../db.js'

// create not complete
export const createStudent = (req, res) => {
    const q = `
        INSERT INTO teacher(login_ID, staff_fname, staff_lname, staff_email, staff_mobile, staff_address, province, district, subdistrict, zipcode, sec_ID) VALUES (?,?,?,?,?,?,?,?,?,?,?)
        `
    const {
        login_ID,
        staff_fname,
        staff_lname,
        staff_email,
        staff_mobile,
        staff_address,
        province,
        district,
        subdistrict,
        zipcode,
        sec_ID,
    } = req.body;
    db.query(q, [
            login_ID,
            staff_fname,
            staff_lname,
            staff_email,
            staff_mobile,
            staff_address,
            province,
            district,
            subdistrict,
            zipcode,
            sec_ID,
        ],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(200).json({
                result
            });
        }
    );
};

// read all
export const readTeacherAll = (req, res) => {
    const sql = `
        SELECT 
            *
        FROM
            teacher
;
        `
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}

//read one
export const readTeacherOne = (req, res) => {
    const sql = 'select t.*, s.* from teacher t left join section s on t.t_ID = s.t_ID  where t.t_ID = ?'
    const {
        id
    } = req.params
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}

//update 
export const updateTeacher = (req, res) => {
    const {
        id
    } = req.params
    const {
        t_fname,
        t_lname,
        t_email,
        t_mobile,
        t_address,
        t_province,
        t_district,
        t_subdistrict,
        t_zipcode,
        sec_ID
    } = req.body
    const q = 'UPDATE `teacher` SET `t_fname`= ?,`t_lname`= ?,`t_email`= ?,`t_mobile`= ?,`t_address`= ?,`t_province`= ?,`t_district`= ?,`t_subdistrict`= ?,`t_zipcode`= ? WHERE t_ID = ?'

    db.query(q, [t_fname,
        t_lname, t_email, t_mobile, t_address, t_province, t_district, t_subdistrict, t_zipcode, id
    ], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}

export const deleteTeacher = (req, res) => {
    const {
        id
    } = req.params;

    const sql1 = 'DELETE FROM teacher WHERE login_ID = ?';
    const sql2 = 'DELETE FROM login WHERE login_ID = ?';

    db.query(sql1, [id], (err, result1) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        db.query(sql2, [id], (err, result2) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            return res.json({
                message: 'Records deleted successfully from both tables',
                studentResult: result1,
                loginResult: result2
            });
        });
    });
};