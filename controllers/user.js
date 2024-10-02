import db from '../db.js'

// user
export const user = (req, res) => {
    const sql = `
        SELECT 
            l.*, 
            s.*,
            COALESCE(t.t_fname, st.std_fname, a.a_fname) AS fname,
            COALESCE(t.t_lname, st.std_lname, a.a_lname) AS lname,
            COALESCE(t.t_email, st.std_email, a.a_email) AS email,
            COALESCE(t.t_mobile, st.std_mobile, a.a_mobile) AS mobile,
            COALESCE(t.t_address, st.std_address) AS address,
            COALESCE(t.t_province, st.std_province) AS province,
            COALESCE(t.t_district, st.std_district) AS district,
            COALESCE(t.t_subdistrict, st.std_subdistrict) AS subdistrict,
            COALESCE(t.t_zipcode, st.std_zipcode) AS zipcode
        FROM 
            login l
        LEFT JOIN teacher t ON l.login_ID = t.login_ID
        LEFT JOIN student st ON l.login_ID = st.login_ID
        LEFT JOIN admin a ON l.login_ID = a.login_ID
        LEFT JOIN section s ON  st.sec_ID  = s.sec_ID  OR t.t_ID = s.t_ID
    `

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}

// get one
export const userOne = (req, res) => {
    const {
        id
    } = req.params
    const sql = `
       SELECT 
            l.*, 
            s.*,
            COALESCE(t.t_fname, st.std_fname, a.a_fname) AS fname,
            COALESCE(t.t_lname, st.std_lname, a.a_lname) AS lname,
            COALESCE(t.t_email, st.std_email, a.a_email) AS email,
            COALESCE(t.t_mobile, st.std_mobile, a.a_mobile) AS mobile,
            COALESCE(t.t_address, st.std_address) AS address,
            COALESCE(t.t_province, st.std_province) AS province,
            COALESCE(t.t_district, st.std_district) AS district,
            COALESCE(t.t_subdistrict, st.std_subdistrict) AS subdistrict,
            COALESCE(t.t_zipcode, st.std_zipcode) AS zipcode
        FROM 
            login l
        LEFT JOIN teacher t ON l.login_ID = t.login_ID
        LEFT JOIN student st ON l.login_ID = st.login_ID
        LEFT JOIN admin a ON l.login_ID = a.login_ID
        LEFT JOIN section s ON  st.sec_ID  = s.sec_ID  OR t.t_ID = s.t_ID
        WHERE l.login_ID = ?
    `

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}


// update user (either teacher or student)
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { role, fname, lname, email, mobile, address, province, district, subdistrict, sec_ID, zipcode } = req.body;

    let sql;
    let values;

    if (role === 'teacher') {
        sql = `
            UPDATE teacher
            SET 
                t_fname = ?,               
                t_lname = ?,               
                t_email = ?,               
                t_mobile = ?,                
                t_address = ?,
                t_province = ?,            
                t_district = ?,            
                t_subdistrict = ?,               
                t_zipcode = ?      
            WHERE 
                login_ID = ?
        `;

        values = [fname, lname, email, mobile, address, province, district, subdistrict, zipcode, id];

        // const {t_ID} = req.body;

        // db.query("UPDATE section SET t_ID = ? WHERE sec_ID = ?",[t_ID, sec_ID], (err, result) => {
        //     if (err) return res.status(500).json({ message: 'Database query failed', error: err });
        //     return res.json({
        //         message: `Section updated successfully`
        // });
        // })
    } else if (role === 'student') {
        sql = `
            UPDATE student
            SET 
                std_fname = ?,               
                std_lname = ?,               
                std_email = ?,               
                std_mobile = ?,                
                std_address = ?,
                sec_ID = ?,
                std_province = ?,            
                std_district = ?,            
                std_subdistrict = ?,               
                std_zipcode = ?      
            WHERE 
                login_ID = ?
        `;
        values = [fname, lname, email, mobile, address, sec_ID, province, district, subdistrict, zipcode, id];
    } else {
        return res.status(400).json({
            message: 'Invalid role specified'
        });
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database query failed', error: err });
        return res.json({
            message: `User updated successfully in the ${role} table`
        });
    });
};

export const deleteUser = (req, res) => {
    
};
