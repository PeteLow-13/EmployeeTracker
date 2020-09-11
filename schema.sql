drop database if exists

create database employee_trackDB;

use employee_trackDB;

create table department(
    id int not null auto_increment,
    primary key (id),
    dept_name varchar(30) not null,
);

create table role(
    id int not null auto_increment,
    primary key (id),
    title varchar(30) not null,
    salary decimal not null,
    department_id int not null
);

create table employee(
    id int not null,
    primary key (id),
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int
); 

-- * **department**:

--   * **id** - INT PRIMARY KEY
--   * **name** - VARCHAR(30) to hold department name

--role--
--   * **id** - INT PRIMARY KEY
--   * **title** -  VARCHAR(30) to hold role title
--   * **salary** -  DECIMAL to hold role salary
--   * **department_id** -  INT to hold reference to department role belongs to
--employee--
-- * **id** - INT PRIMARY KEY
--   * **first_name** - VARCHAR(30) to hold employee first name
--   * **last_name** - VARCHAR(30) to hold employee last name
--   * **role_id** - INT to hold reference to role employee has
--   * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager