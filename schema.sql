drop database if exists employee_trackDB;

create database employee_trackDB;

use employee_trackDB;

create table department(
    id int not null auto_increment,
    primary key (id),
    name varchar(30) not null
);

create table role(
    id int not null auto_increment,
    primary key (id),
    title varchar(30) not null,
    salary decimal not null,
    department_id int not null
);


create table employee(
    id int not null auto_increment,
    primary key (id),
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int 
); 
