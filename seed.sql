insert into department (name)
values ("management");
insert into department (name)
values ("sales");

insert into role(title, salary, department_id)
values ("manager", 10000, 2);
insert into role(title, salary, department_id)
values ("salesperson", 5000, 3);

insert into employee (first_name, last_name, role_id, manager_id)
values ("Mina", "the Bird", 27, 3);
insert into employee (first_name, last_name, role_id, manager_id)
values ("frank", "the Bird", 198, 4);