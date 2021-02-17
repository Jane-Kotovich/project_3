DROP TABLE schedule;
CREATE TABLE schedule (
    user_id serial PRIMARY KEY, 
    firstname VARCHAR(50) NOT NULL , 
    lastname VARCHAR(50) NOT NULL, 
    week_day INTEGER NOT NULL, 
    start_time TIME NOT NULL, 
    end_time TIME NOT NULL
    );