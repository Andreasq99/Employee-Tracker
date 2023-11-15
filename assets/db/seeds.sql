INSERT INTO departments (dept_name)
VALUES ("Marketing"),
       ("Sales"),
       ("Human Resources"),
       ("Tech Support");

INSERT INTO roles (title,dept_id,salary)
VALUES  ("Analyst",1,45),
        ("SEO",1,40),
        ("Assistant Manager",2,50),
        ("Account Manager",2,40),
        ("Administrator",3,50),
        ("Agent",3,35),
        ("Junior IT Specialist", 4, 35),
        ("Senior IT Specialist",4,45);

INSERT INTO employees (first_name,last_name,role_id,manager)
VALUES  ("Jordan","Schlansky",1, "Conan O'Brien"),
        ("Zach","Galifianakis",2,"Conan O'Brien"),
        ("Jim","Halpert",4,"Michael Scott"),
        ("Dwight","Schrute",3,"Michael Scott"),
        ("Tim","Heidecker",5,"Eric Wareheim"),
        ("Bradley","Cooper",6,"Eric Wareheim"),
        ("Keanu","Reeves",7,"Trinity"),
        ("Chuck","Bartowski",7,"Trinity"),
        ("Neo","",8,"Trinity");
