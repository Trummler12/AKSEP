-- Deaktiviere Checks (optimiert Bulk-Import)
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
SET GLOBAL LOCAL_INFILE=TRUE;

-- Schema anlegen
CREATE database IF NOT EXISTS `schoolsystem`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `schoolsystem`;

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


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_tag` (
  `tagID` INT NOT NULL,
  `tag` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`tagID`),
  UNIQUE INDEX `tagID_UNIQUE` (`tagID` ASC) VISIBLE,
  UNIQUE INDEX `tag_UNIQUE` (`tag` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_topic_type` (
  `typeID` TINYINT NOT NULL,
  `type_name` VARCHAR(45) NULL,
  `definition` TEXT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`typeID`),
  UNIQUE INDEX `typeID_UNIQUE` (`typeID` ASC) VISIBLE,
  UNIQUE INDEX `type_name_UNIQUE` (`type_name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_topic` (
  `topicID` VARCHAR(10) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `typeID` TINYINT NOT NULL,
  `layer` TINYINT NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`topicID`),
  INDEX `fk_type_idx` (`typeID` ASC) VISIBLE,
  UNIQUE INDEX `topicID_UNIQUE` (`topicID` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  CONSTRAINT `fk_t_type`
    FOREIGN KEY (`typeID`)
    REFERENCES `schoolsystem`.`t_topic_type` (`typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic_url`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_topic_url` (
  `topicID` VARCHAR(10) NOT NULL,
  `urlNr` TINYINT NOT NULL,
  `url` TEXT NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`topicID`, `urlNr`),
  INDEX `fk_tu_topic_idx` (`topicID` ASC) VISIBLE,
  CONSTRAINT `fk_tu_topic`
    FOREIGN KEY (`topicID`)
    REFERENCES `schoolsystem`.`t_topic` (`topicID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic_level`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_topic_level` (
  `topicID` VARCHAR(10) NOT NULL,
  `level_number` TINYINT NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`topicID`, `level_number`),
  CONSTRAINT `fk_l_topic`
    FOREIGN KEY (`topicID`)
    REFERENCES `schoolsystem`.`t_topic` (`topicID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_sublevel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_sublevel` (
  `topicID` VARCHAR(10) NOT NULL,
  `level` TINYINT NOT NULL,
  `sublevelID` VARCHAR(10) NOT NULL,
  `description` TEXT NULL,
  `target_skills` TEXT NULL,
  `advanced_skills` TEXT NULL,
  `next_level_skills` TEXT NULL,
  `isActive` TINYINT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`topicID`, `level`, `sublevelID`),
  CONSTRAINT `fk_sl_level`
    FOREIGN KEY (`topicID` , `level`)
    REFERENCES `schoolsystem`.`t_topic_level` (`topicID` , `level_number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_topic_tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_topic_tags` (
  `topicID` VARCHAR(10) NOT NULL,
  `tagID` INT NOT NULL,
  `weight` TINYINT NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`topicID`, `tagID`),
  INDEX `fk_tht_topic_idx` (`topicID` ASC) VISIBLE,
  INDEX `fk_tht_tag_idx` (`tagID` ASC) VISIBLE,
  CONSTRAINT `fk_tht_topic`
    FOREIGN KEY (`topicID`)
    REFERENCES `schoolsystem`.`t_topic` (`topicID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_tht_tag`
    FOREIGN KEY (`tagID`)
    REFERENCES `schoolsystem`.`t_tag` (`tagID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_req_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_req_type` (
  `req_typeID` TINYINT NOT NULL,
  `req_type` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`req_typeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_lrequirements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_lrequirements` (
  `target_topicID` VARCHAR(10) NOT NULL,
  `target_level` TINYINT NOT NULL,
  `required_topicID` VARCHAR(10) NOT NULL,
  `required_level` TINYINT NOT NULL,
  `req_typeID` TINYINT NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`target_topicID`, `target_level`, `required_topicID`, `required_level`),
  INDEX `fk_lreq_required` (`required_topicID` ASC, `required_level` ASC) VISIBLE,
  INDEX `fk_lreq_req_type_idx` (`req_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_lreq_required`
    FOREIGN KEY (`required_topicID` , `required_level`)
    REFERENCES `schoolsystem`.`t_topic_level` (`topicID` , `level_number`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_lreq_target`
    FOREIGN KEY (`target_topicID` , `target_level`)
    REFERENCES `schoolsystem`.`t_topic_level` (`topicID` , `level_number`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_lreq_req_type`
    FOREIGN KEY (`req_typeID`)
    REFERENCES `schoolsystem`.`t_req_type` (`req_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_language`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_language` (
  `languageID` VARCHAR(3) NOT NULL,
  `language` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`languageID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_timezone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_timezone` (
  `timezoneID` VARCHAR(8) NOT NULL,
  `timezone_name` VARCHAR(45) NULL,
  `regions` TEXT NULL,
  `utc_offset` VARCHAR(10) NULL,
  `daylight_saving_time` TINYINT(1) NULL,
  `example_cities` TEXT NULL,
  `description` TEXT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`timezoneID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_user` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `last_name` VARCHAR(100) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NULL DEFAULT NULL,
  `main_languageID` VARCHAR(3) NULL DEFAULT NULL,
  `timezone` VARCHAR(8) NULL DEFAULT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`userID`),
  UNIQUE INDEX `userID_UNIQUE` (`userID` ASC) VISIBLE,
  INDEX `fk_u_language_idx` (`main_languageID` ASC) VISIBLE,
  INDEX `fk_u_timezone_idx` (`timezone` ASC) VISIBLE,
  CONSTRAINT `fk_u_language`
    FOREIGN KEY (`main_languageID`)
    REFERENCES `schoolsystem`.`t_language` (`languageID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_u_timezone`
    FOREIGN KEY (`timezone`)
    REFERENCES `schoolsystem`.`t_timezone` (`timezoneID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_address_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_address_type` (
  `address_typeID` TINYINT NOT NULL,
  `adress_type` VARCHAR(45) NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`address_typeID`),
  UNIQUE INDEX `adress_type_UNIQUE` (`adress_type` ASC) VISIBLE,
  UNIQUE INDEX `address_typeID_UNIQUE` (`address_typeID` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_u_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_u_address` (
  `userID` INT NOT NULL,
  `address_typeID` TINYINT NOT NULL,
  `street` VARCHAR(150) NULL DEFAULT NULL,
  `house_number` VARCHAR(10) NULL DEFAULT NULL,
  `address_addition` VARCHAR(100) NULL DEFAULT NULL,
  `city` VARCHAR(100) NULL DEFAULT NULL,
  `postal_code` VARCHAR(20) NULL DEFAULT NULL,
  `country` VARCHAR(50) NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`userID`, `address_typeID`),
  INDEX `fk_sa_atype_idx` (`address_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_sad_user`
    FOREIGN KEY (`userID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sad_atypeu`
    FOREIGN KEY (`address_typeID`)
    REFERENCES `schoolsystem`.`t_address_type` (`address_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_contact_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_contact_type` (
  `contact_typeID` TINYINT NOT NULL,
  `contact_type` VARCHAR(45) NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`contact_typeID`),
  UNIQUE INDEX `contact_typeID_UNIQUE` (`contact_typeID` ASC) VISIBLE,
  UNIQUE INDEX `contact_type_UNIQUE` (`contact_type` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_user_contact`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_user_contact` (
  `userID` INT NOT NULL,
  `contact_typeID` TINYINT NOT NULL,
  `entryNr` TINYINT NOT NULL,
  `contact_adress` VARCHAR(127) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`userID`, `contact_typeID`, `entryNr`),
  INDEX `fk_uc_contact_idx` (`contact_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_uc_contact`
    FOREIGN KEY (`contact_typeID`)
    REFERENCES `schoolsystem`.`t_contact_type` (`contact_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_uc_user`
    FOREIGN KEY (`userID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_source_author`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_source_author` (
  `sauthorID` INT NOT NULL,
  `sauthor_name` VARCHAR(127) NULL,
  `sauthor_URL` TEXT NULL,
  `sauthor_description` TEXT NULL,
  `impressum_URL` TEXT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`sauthorID`),
  UNIQUE INDEX `sauthorID_UNIQUE` (`sauthorID` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_source_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_source_type` (
  `stypeID` INT NOT NULL,
  `stype_name` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`stypeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_source`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_source` (
  `sourceID` INT NOT NULL,
  `source_typeID` INT NOT NULL,
  `source_URL` TEXT NULL,
  `sauthorID` INT NULL,
  `source_title` TEXT NULL,
  `description` TEXT NULL,
  `created` DATETIME NULL,
  `updated` DATETIME NULL,
  `sa_resource` TINYINT(1) DEFAULT 0,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`sourceID`),
  INDEX `fk_s_sauthor_idx` (`sauthorID` ASC) VISIBLE,
  INDEX `fk_s_stype_idx` (`source_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_s_sauthor`
    FOREIGN KEY (`sauthorID`)
    REFERENCES `schoolsystem`.`t_source_author` (`sauthorID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_s_stype`
    FOREIGN KEY (`source_typeID`)
    REFERENCES `schoolsystem`.`t_source_type` (`stypeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_author`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_author` (
  `authorID` INT NOT NULL,
  `profile` TEXT NULL DEFAULT NULL,
  `settings` JSON NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`authorID`),
  UNIQUE INDEX `authorID_UNIQUE` (`authorID` ASC) VISIBLE,
  CONSTRAINT `fk_a_user`
    FOREIGN KEY (`authorID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_resource_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_resource_type` (
  `rstypeID` INT NOT NULL,
  `rstype_name` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`rstypeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_resource`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_resource` (
  `resourceID` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `resource_type` INT NULL,
  `is_active` TINYINT(1) NULL DEFAULT '1',
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`resourceID`),
  UNIQUE INDEX `resourceID_UNIQUE` (`resourceID` ASC) VISIBLE,
  INDEX `fk_r_rstype_idx` (`resource_type` ASC) VISIBLE,
  CONSTRAINT `fk_r_rstype`
    FOREIGN KEY (`resource_type`)
    REFERENCES `schoolsystem`.`t_resource_type` (`rstypeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_uses_source`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_uses_source` (
  `sourceID` INT NOT NULL,
  `resourceID` INT NOT NULL,
  `usage_date` DATETIME NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`sourceID`, `resourceID`),
  INDEX `fk_ru_resource_idx` (`resourceID` ASC) VISIBLE,
  CONSTRAINT `fk_ru_source`
    FOREIGN KEY (`sourceID`)
    REFERENCES `schoolsystem`.`t_source` (`sourceID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ru_resource`
    FOREIGN KEY (`resourceID`)
    REFERENCES `schoolsystem`.`t_resource` (`resourceID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_version`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_version` (
  `versionID` INT NOT NULL AUTO_INCREMENT,
  `resourceID` INT NOT NULL,
  `version_number` VARCHAR(20) NOT NULL,
  `changelog` TEXT NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`versionID`),
  INDEX `fk_ver_resource_idx` (`resourceID` ASC) VISIBLE,
  UNIQUE INDEX `versionID_UNIQUE` (`versionID` ASC) VISIBLE,
  CONSTRAINT `fk_ver_resource`
    FOREIGN KEY (`resourceID`)
    REFERENCES `schoolsystem`.`t_resource` (`resourceID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_lang_version`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_lang_version` (
  `languageVersionID` INT NOT NULL AUTO_INCREMENT,
  `versionID` INT NOT NULL,
  `authorID` INT NOT NULL,
  `languageID` VARCHAR(3) NOT NULL,
  `publication_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `translator_info` VARCHAR(150) NULL DEFAULT NULL,
  `own_share` DECIMAL(5,2) NULL,
  `rest_belongs_to` INT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`languageVersionID`),
  INDEX `fk_lv_version_idx` (`versionID` ASC) VISIBLE,
  INDEX `fk_lv_author_idx` (`authorID` ASC) VISIBLE,
  INDEX `fk_lngv_rs_to_idx` (`rest_belongs_to` ASC) VISIBLE,
  INDEX `fk_lngv_language_idx` (`languageID` ASC) VISIBLE,
  CONSTRAINT `fk_lngv_author`
    FOREIGN KEY (`authorID`)
    REFERENCES `schoolsystem`.`t_author` (`authorID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_lngv_version`
    FOREIGN KEY (`versionID`)
    REFERENCES `schoolsystem`.`t_version` (`versionID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_lngv_rs_to`
    FOREIGN KEY (`rest_belongs_to`)
    REFERENCES `schoolsystem`.`t_author` (`authorID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lngv_language`
    FOREIGN KEY (`languageID`)
    REFERENCES `schoolsystem`.`t_language` (`languageID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_resource_to_level`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_resource_to_level` (
  `resourceID` INT NOT NULL,
  `topicID` VARCHAR(10) NOT NULL,
  `level` TINYINT NOT NULL,
  `sublevelID` VARCHAR(10) NOT NULL DEFAULT '0',
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`resourceID`, `topicID`, `level`, `sublevelID`),
  INDEX `fk_rtl_level_idx` (`topicID` ASC, `level` ASC) VISIBLE,
  CONSTRAINT `fk_rtl_level`
    FOREIGN KEY (`topicID` , `level`)
    REFERENCES `schoolsystem`.`t_topic_level` (`topicID` , `level_number`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_rtl_resource`
    FOREIGN KEY (`resourceID`)
    REFERENCES `schoolsystem`.`t_resource` (`resourceID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_inter_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_inter_type` (
  `interaction_typeID` TINYINT NOT NULL,
  `interaction` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`interaction_typeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_rinteraction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_rinteraction` (
  `userID` INT NOT NULL,
  `resourceID` INT NOT NULL,
  `interaction_typeID` TINYINT NOT NULL,
  `usage_date` DATETIME NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`userID`, `resourceID`, `interaction_typeID`),
  INDEX `fk_int_resource_idx` (`resourceID` ASC) VISIBLE,
  INDEX `fk_int_inttype_idx` (`interaction_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_int_user`
    FOREIGN KEY (`userID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_int_resource`
    FOREIGN KEY (`resourceID`)
    REFERENCES `schoolsystem`.`t_resource` (`resourceID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_int_inttype`
    FOREIGN KEY (`interaction_typeID`)
    REFERENCES `schoolsystem`.`t_inter_type` (`interaction_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_reviews` (
  `userID` INT NOT NULL,
  `resourceID` INT NOT NULL,
  `entryID` INT NOT NULL,
  `isTeacher` TINYINT(1) NULL DEFAULT '0',
  `isAuthor` TINYINT(1) NULL DEFAULT '0',
  `isCompanyResponsible` TINYINT(1) NULL DEFAULT '0',
  `rating` TINYINT NULL DEFAULT NULL,
  `title` VARCHAR(127) NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `review_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`userID`, `resourceID`, `entryID`),
  INDEX `fk_rev_resource_idx` (`resourceID` ASC) VISIBLE,
  INDEX `fk_rev_user_idx` (`userID` ASC) VISIBLE,
  CONSTRAINT `fk_rev_resource`
    FOREIGN KEY (`resourceID`)
    REFERENCES `schoolsystem`.`t_resource` (`resourceID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_rev_user`
    FOREIGN KEY (`userID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_school`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_school` (
  `schoolID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `school_type` VARCHAR(50) NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`schoolID`),
  UNIQUE INDEX `schoolID_UNIQUE` (`schoolID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_s_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_s_address` (
  `schoolID` INT NOT NULL,
  `address_typeID` TINYINT NOT NULL,
  `street` VARCHAR(150) NULL DEFAULT NULL,
  `house_number` VARCHAR(10) NULL DEFAULT NULL,
  `address_addition` VARCHAR(100) NULL DEFAULT NULL,
  `city` VARCHAR(100) NULL DEFAULT NULL,
  `postal_code` VARCHAR(20) NULL DEFAULT NULL,
  `country` VARCHAR(50) NULL DEFAULT NULL,
  `longitude` DOUBLE NULL DEFAULT NULL,
  `latitude` DOUBLE NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`schoolID`, `address_typeID`),
  INDEX `fk_sa_atype_idx` (`address_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_sad_school`
    FOREIGN KEY (`schoolID`)
    REFERENCES `schoolsystem`.`t_school` (`schoolID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sad_atypes`
    FOREIGN KEY (`address_typeID`)
    REFERENCES `schoolsystem`.`t_address_type` (`address_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_spec`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_spec` (
  `specID` INT NOT NULL AUTO_INCREMENT,
  `schoolID` INT NOT NULL,
  `spec_name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `min_age` INT NULL,
  `max_age` INT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`specID`, `schoolID`),
  INDEX `fk_s_school` (`schoolID` ASC) VISIBLE,
  UNIQUE INDEX `specID_UNIQUE` (`specID` ASC) VISIBLE,
  CONSTRAINT `fk_s_school`
    FOREIGN KEY (`schoolID`)
    REFERENCES `schoolsystem`.`t_school` (`schoolID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_srequirements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_srequirements` (
  `schoolID` INT NOT NULL,
  `specID` INT NOT NULL,
  `topicID` VARCHAR(10) NOT NULL,
  `level` TINYINT NOT NULL,
  `req_typeID` TINYINT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`specID`, `schoolID`, `topicID`),
  INDEX `fk_sreq_level_idx` (`topicID` ASC, `level` ASC) VISIBLE,
  INDEX `fk_sreq_req_type_idx` (`req_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_sreq_spec`
    FOREIGN KEY (`specID` , `schoolID`)
    REFERENCES `schoolsystem`.`t_spec` (`specID` , `schoolID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_sreq_level`
    FOREIGN KEY (`topicID` , `level`)
    REFERENCES `schoolsystem`.`t_topic_level` (`topicID` , `level_number`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_sreq_req_type`
    FOREIGN KEY (`req_typeID`)
    REFERENCES `schoolsystem`.`t_req_type` (`req_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_teacher` (
  `teacherID` INT NOT NULL,
  `settings` JSON NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`teacherID`),
  UNIQUE INDEX `teacherID_UNIQUE` (`teacherID` ASC) VISIBLE,
  CONSTRAINT `fk_t_user`
    FOREIGN KEY (`teacherID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_teaching`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_teaching` (
  `teacherID` INT NOT NULL,
  `topicID` VARCHAR(10) NOT NULL,
  `schoolID` INT NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`teacherID`, `topicID`, `schoolID`),
  INDEX `fk_t_topic_idx` (`topicID` ASC) VISIBLE,
  INDEX `fk_t_school_idx` (`schoolID` ASC) VISIBLE,
  CONSTRAINT `fk_t_teacher`
    FOREIGN KEY (`teacherID`)
    REFERENCES `schoolsystem`.`t_teacher` (`teacherID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_topic`
    FOREIGN KEY (`topicID`)
    REFERENCES `schoolsystem`.`t_topic` (`topicID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_school`
    FOREIGN KEY (`schoolID`)
    REFERENCES `schoolsystem`.`t_school` (`schoolID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_class`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_class` (
  `schoolID` INT NOT NULL,
  `classID` VARCHAR(45) NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`schoolID`, `classID`),
  CONSTRAINT `fk_c_school`
    FOREIGN KEY (`schoolID`)
    REFERENCES `schoolsystem`.`t_school` (`schoolID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_class_teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_class_teacher` (
  `teacherID` INT NOT NULL,
  `schoolID` INT NOT NULL,
  `classID` VARCHAR(45) NOT NULL,
  `from_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `until_date` DATETIME NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`teacherID`, `schoolID`, `classID`),
  INDEX `fk_ct_class_idx` (`schoolID` ASC, `classID` ASC) VISIBLE,
  CONSTRAINT `fk_ct_teacher`
    FOREIGN KEY (`teacherID`)
    REFERENCES `schoolsystem`.`t_teacher` (`teacherID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ct_class`
    FOREIGN KEY (`schoolID` , `classID`)
    REFERENCES `schoolsystem`.`t_class` (`schoolID` , `classID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_student` (
  `studentID` INT NOT NULL,
  `settings` JSON NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`studentID`),
  UNIQUE INDEX `studentID_UNIQUE` (`studentID` ASC) VISIBLE,
  CONSTRAINT `fk_s_user`
    FOREIGN KEY (`studentID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_visited_classes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_visited_classes` (
  `schoolID` INT NOT NULL,
  `classID` VARCHAR(45) NOT NULL,
  `studentID` INT NOT NULL,
  `entryID` INT NOT NULL,
  `fromDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `untilDate` DATETIME NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`schoolID`, `classID`, `studentID`, `entryID`),
  INDEX `fk_student_idx` (`studentID` ASC) VISIBLE,
  CONSTRAINT `fk_vc_school`
    FOREIGN KEY (`schoolID` , `classID`)
    REFERENCES `schoolsystem`.`t_class` (`schoolID` , `classID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vc_student`
    FOREIGN KEY (`studentID`)
    REFERENCES `schoolsystem`.`t_student` (`studentID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_student_levels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_student_levels` (
  `studentID` INT NOT NULL,
  `topicID` VARCHAR(10) NOT NULL,
  `achieved_level` TINYINT NOT NULL,
  `half_level` TINYINT(1) NOT NULL,
  `achieved_date` DATE NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`studentID`, `topicID`, `achieved_level`, `half_level`),
  INDEX `fk_stlevels_topic_idx` (`topicID` ASC, `achieved_level` ASC) VISIBLE,
  CONSTRAINT `fk_stlevels_topic`
    FOREIGN KEY (`topicID` , `achieved_level`)
    REFERENCES `schoolsystem`.`t_topic_level` (`topicID` , `level_number`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_stlevels_student`
    FOREIGN KEY (`studentID`)
    REFERENCES `schoolsystem`.`t_student` (`studentID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_crepresentative`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_crepresentative` (
  `representID` INT NOT NULL,
  `settings` JSON NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`representID`),
  UNIQUE INDEX `representID_UNIQUE` (`representID` ASC) VISIBLE,
  CONSTRAINT `fk_rep_user`
    FOREIGN KEY (`representID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_representing`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_representing` (
  `representID` INT NOT NULL,
  `companyID` INT NOT NULL,
  `role` INT NULL,
  `from_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `until_date` DATETIME NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`representID`, `companyID`),
  INDEX `companyID_idx` (`companyID` ASC) VISIBLE,
  CONSTRAINT `fk_rep_company`
    FOREIGN KEY (`companyID`)
    REFERENCES `schoolsystem`.`t_company` (`companyID`),
  CONSTRAINT `fk_rep_rep`
    FOREIGN KEY (`representID`)
    REFERENCES `schoolsystem`.`t_crepresentative` (`representID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_company` (
  `companyID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`companyID`),
  UNIQUE INDEX `companyID_UNIQUE` (`companyID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_c_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_c_address` (
  `companyID` INT NOT NULL,
  `address_typeID` TINYINT NOT NULL,
  `street` VARCHAR(150) NULL DEFAULT NULL,
  `house_number` VARCHAR(10) NULL DEFAULT NULL,
  `address_addition` VARCHAR(100) NULL DEFAULT NULL,
  `city` VARCHAR(100) NULL DEFAULT NULL,
  `postal_code` VARCHAR(20) NULL DEFAULT NULL,
  `country` VARCHAR(50) NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`companyID`, `address_typeID`),
  INDEX `fk_sa_atype_idx` (`address_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_sad_company`
    FOREIGN KEY (`companyID`)
    REFERENCES `schoolsystem`.`t_company` (`companyID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sad_atypec`
    FOREIGN KEY (`address_typeID`)
    REFERENCES `schoolsystem`.`t_address_type` (`address_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_job`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_job` (
  `jobID` INT NOT NULL AUTO_INCREMENT,
  `job_name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`jobID`),
  UNIQUE INDEX `jobID_UNIQUE` (`jobID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_jobdef`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_jobdef` (
  `jobID` INT NOT NULL,
  `companyID` INT NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`jobID`, `companyID`),
  INDEX `fk_jdef_company` (`companyID` ASC) VISIBLE,
  CONSTRAINT `fk_jdef_company`
    FOREIGN KEY (`companyID`)
    REFERENCES `schoolsystem`.`t_company` (`companyID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_jdef_job`
    FOREIGN KEY (`jobID`)
    REFERENCES `schoolsystem`.`t_job` (`jobID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_jrequirements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_jrequirements` (
  `jobID` INT NOT NULL,
  `companyID` INT NOT NULL,
  `topicID` VARCHAR(10) NOT NULL,
  `level` TINYINT NOT NULL,
  `weight` ENUM('Core', 'Medium', 'Supplementary') NULL DEFAULT 'Medium',
  `req_typeID` TINYINT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`jobID`, `companyID`, `topicID`),
  INDEX `fk_jreq_level` (`topicID` ASC, `level` ASC) VISIBLE,
  INDEX `fk_jreq_req_type_idx` (`req_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_jreq_jdef`
    FOREIGN KEY (`jobID` , `companyID`)
    REFERENCES `schoolsystem`.`ct_jobdef` (`jobID` , `companyID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_jreq_level`
    FOREIGN KEY (`topicID` , `level`)
    REFERENCES `schoolsystem`.`t_topic_level` (`topicID` , `level_number`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_jreq_req_type`
    FOREIGN KEY (`req_typeID`)
    REFERENCES `schoolsystem`.`t_req_type` (`req_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;