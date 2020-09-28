insert into department (name)
values ("management");
insert into department (name)
values ("sales");

insert into role(title, salary, department_id)
values ("manager", 10000, 1);
insert into role(title, salary, department_id)
values ("salesperson", 5000, 2);
insert into role(title, salary, department_id)
values ("accountant", 5000, 2);

insert into employee (first_name, last_name, role_id, manager_id)
values ("Mina", "the Bird", 1);
insert into employee (first_name, last_name, role_id, manager_id)
values ("frank", "the Bird", 2, 1);
insert into employee (first_name, last_name, role_id, manager_id)
values ("chauncey", "the dog",2, 1);
insert into employee (first_name, last_name, role_id, manager_id)
values ("pete", "the turtle", 3, 2);