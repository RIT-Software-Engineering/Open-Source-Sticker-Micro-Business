-- defaults to innoDB in case future changes to mySQL
CREATE TABLE IF NOT EXISTS `User` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255),
    `passwordHash` VARCHAR(255),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `PermissionType` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255),
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK_PermissionType_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Permission` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `permissionTypeId` INT,
    PRIMARY KEY (`id`),
    KEY `IDX_Permission_permissionTypeId` (`permissionTypeId`),
    CONSTRAINT `FK_Permission_permissionType`
        FOREIGN KEY (`permissionTypeId`) REFERENCES `PermissionType` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `UserPermission` (
    `userId` INT NOT NULL,
    `permissionId` INT NOT NULL,
    PRIMARY KEY (`userId`, `permissionId`),
    KEY `IDX_UserPermission_permissionId` (`permissionId`),
    CONSTRAINT `FK_UserPermission_user`
        FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    CONSTRAINT `FK_UserPermission_permission`
        FOREIGN KEY (`permissionId`) REFERENCES `Permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Tag` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(255),
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK_Tag_label` (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Sticker` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255),
    `length` DOUBLE NOT NULL,
    `width` DOUBLE NOT NULL,
    `desc` VARCHAR(255),
    `svgPath` VARCHAR(255),
    `active` TINYINT(1) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `StickerSheets` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `filePath` VARCHAR(255),
    `stickerIdsJSON` LONGTEXT,
    `stickerIds` LONGTEXT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `PlacedOrder` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `customerId` INT,
    `placementTimestamp` TIMESTAMP(6),
    `status` VARCHAR(255),
    `addressJSON` LONGTEXT,
    `note` VARCHAR(255),
    `address` LONGTEXT,
    PRIMARY KEY (`id`),
    KEY `IDX_PlacedOrder_customerId` (`customerId`),
    CONSTRAINT `FK_PlacedOrder_customer`
        FOREIGN KEY (`customerId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `OrderItems` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `orderId` INT,
    `sheetId` INT,
    `quantity` INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_OrderItems_orderId` (`orderId`),
    KEY `IDX_OrderItems_sheetId` (`sheetId`),
    CONSTRAINT `FK_OrderItems_order`
        FOREIGN KEY (`orderId`) REFERENCES `PlacedOrder` (`id`),
    CONSTRAINT `FK_OrderItems_sheet`
        FOREIGN KEY (`sheetId`) REFERENCES `StickerSheets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `OrderItemsStatus` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `orderItemsId` INT,
    `complete` TINYINT(1) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK_OrderItemsStatus_orderItemsId` (`orderItemsId`),
    CONSTRAINT `FK_OrderItemsStatus_orderItem`
        FOREIGN KEY (`orderItemsId`) REFERENCES `OrderItems` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `OrderUpdates` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `orderId` INT,
    `timestamp` TIMESTAMP(6),
    `orderType` VARCHAR(255),
    PRIMARY KEY (`id`),
    KEY `IDX_OrderUpdates_orderId` (`orderId`),
    CONSTRAINT `FK_OrderUpdates_order`
        FOREIGN KEY (`orderId`) REFERENCES `PlacedOrder` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Collection` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255),
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK_Collection_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `CollectionItems` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `stickerId` INT,
    `collectionId` INT,
    PRIMARY KEY (`id`),
    KEY `IDX_CollectionItems_stickerId` (`stickerId`),
    KEY `IDX_CollectionItems_collectionId` (`collectionId`),
    CONSTRAINT `FK_CollectionItems_sticker`
        FOREIGN KEY (`stickerId`) REFERENCES `Sticker` (`id`),
    CONSTRAINT `FK_CollectionItems_collection`
        FOREIGN KEY (`collectionId`) REFERENCES `Collection` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `TagItems` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `tagId` INT,
    `stickerId` INT,
    PRIMARY KEY (`id`),
    KEY `IDX_TagItems_tagId` (`tagId`),
    KEY `IDX_TagItems_stickerId` (`stickerId`),
    CONSTRAINT `TAG_ID_FK`
        FOREIGN KEY (`tagId`) REFERENCES `Tag` (`id`),
    CONSTRAINT `STICKER_ID_FK`
        FOREIGN KEY (`stickerId`) REFERENCES `Sticker` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;