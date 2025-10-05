/* TABLE BUILD ORDER

t_tag
t_topic_type
t_topic
t_topic_url
t_topic_level
t_sublevel
ct_topic_tags

t_req_type
ct_lrequirements

t_language
t_timezone


t_user
t_address_type
ct_u_address
t_contact_type
ct_user_contact

t_source_author
t_source_type
t_source

t_author
t_resource_type
t_resource
ct_uses_source

t_version
t_lang_version
ct_resource_to_level

t_inter_type
ct_rinteraction

t_reviews


t_school
ct_s_address
t_spec
ct_srequirements

t_teacher
ct_teaching

t_class
ct_class_teacher
t_student
ct_visited_classes
ct_student_levels


t_crepresentative
ct_representing
t_company
ct_c_address
t_job
ct_jobdef
ct_jrequirements
*/

USE `schoolsystem`;

-- -----------------------------------------------------
-- Table `schoolsystem`.`t_tag`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_tag.csv'
INTO TABLE t_tag
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(tagID,tag);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic_type`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_topic_type.csv'
INTO TABLE t_topic_type
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(typeID,type_name,definition);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_topic.csv'
INTO TABLE t_topic
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(topicID,name,typeID,layer,description);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic_url`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_topic_url.csv'
INTO TABLE t_topic_url
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(topicID,urlNr,url);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic_level`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_topic_levels.csv'
INTO TABLE t_topic_level
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(topicID,level_number,description);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_sublevel`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_topic_tags`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/ct_topic_tags.csv'
INTO TABLE ct_topic_tags
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(topicID,tagID,weight);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_req_type`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_req_type.csv'
INTO TABLE t_req_type
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(req_typeID,req_type);


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_lrequirements`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/ct_lrequirements.csv'
INTO TABLE ct_lrequirements
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(target_topicID,target_level,required_topicID,required_level,req_typeID);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_language`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_language.csv'
INTO TABLE t_language
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(languageID,language);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_timezone`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_timezone.csv'
INTO TABLE t_timezone
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(timezoneID,timezone_name,regions,utc_offset,daylight_saving_time,example_cities,description);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_user`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_address_type`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_u_address`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_contact_type`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_contact_type.csv'
INTO TABLE t_contact_type
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(contact_typeID,contact_type);


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_user_contact`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_source_author`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_source_author.csv.lnk'
INTO TABLE t_source_author
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(sauthorID,sauthor_name,sauthor_URL,sauthor_description,impressum_URL);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_source_type`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_source_type.csv'
INTO TABLE t_source_type
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(stypeID,stype_name);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_source`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_source.csv.lnk'
INTO TABLE t_source
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(sourceID,source_typeID,source_URL,sauthorID,source_title,description,created,updated,sa_resource);



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_author`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_resource_type`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_resource_type.csv'
INTO TABLE t_resource_type
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(rstypeID,rstype_name);


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_resource`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_uses_source`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_version`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_lang_version`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_resource_to_level`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_inter_type`
-- -----------------------------------------------------

LOAD DATA LOCAL INFILE 'SchoolsystemCSV/t_inter_type.csv'
INTO TABLE t_inter_type
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(interaction_typeID,interaction);


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_rinteraction`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_reviews`
-- -----------------------------------------------------


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_school`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_s_address`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_spec`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_srequirements`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_teacher`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_teaching`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_class`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_class_teacher`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_student`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_visited_classes`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_student_levels`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_crepresentative`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_representing`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_company`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_c_address`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`t_job`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_jobdef`
-- -----------------------------------------------------



-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_jrequirements`
-- -----------------------------------------------------
