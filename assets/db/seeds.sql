INSERT INTO departments (dept_name)
VALUES ("Marketing"),
       ("Sales"),
       ("Human Resources"),
       ("Tech Support");

INSERT INTO roles (title,dept_id,salary)
VALUES  ("Manager",1,50),
        ("Analyst",1,45),
        ("SEO",1,40),
        ("Manager",2,50),
        ("Account Manager",2,40),
        ("Manager",3,50),
        ("Agent",3,35),
        ("Manager",4,50),
        ("Junior IT Specialist", 4, 35),
        ("Senior IT Specialist",4,45);

INSERT INTO employees (first_name,last_name,role_id)
VALUES  ("Jim","Halpert",5),
        ("Dwight","Schrute",4),
        ("Conan","O'Brian",1),
        ("Jordan","Schlansky",2),
        ("Zach","Galifianakis",3),
        ("Tim","Heidecker",6),
        ("Bradley","Cooper",7),
        ("Keanu","Reeves",8),
        ("Chuck","Bartowski",9),
        ("Neo","",10);
