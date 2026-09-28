namespace poapplication.db;

using { cuid, Currency } from '@sap/cds/common';
using { app.common as c } from './comman';

context master {

    entity BusinessPartners {
        key NODE_KEY : c.Guid;

        BP_ROLE      : c.Role;
        EMAIL        : c.Email;
        MOBILE       : c.PhoneNumber;
        FAX          : c.String32;
        WEB          : c.String255;
        BP_ID        : c.Guid;
        COMPANY_NAME : c.String255;

        AD : Association to Addresses;
    }

    entity Addresses : c.Address {
        key NODE_KEY : c.Guid;

        ADDRESS_TYPE : c.String32;
        VAL_START    : Date;
        VAL_END      : Date;
        LATITUDE     : Decimal;
        LONGITUDE    : Decimal;

        BP : Association to one BusinessPartners
            on BP.AD = $self;
    }

    entity Products {
        key NODE_KEY : c.Guid;

        PRODUCT_ID      : c.String32;
        TYPE_CODE       : String(2);
        CATEGORY        : c.String32;
        DESCRIPTION     : c.String255;
        TAX_TARIF_CODE  : Integer;
        MEASURE_UNIT    : String(2);
        WEIGHT_MEASURE  : Decimal(5, 2);
        WEIGHT_UNIT     : String(2);
        PRICE           : Decimal(15, 2);
        CURRENCY_CODE   : String(5);
        WIDTH           : Decimal(5, 2);
        DEPTH           : Decimal(5, 2);
        HEIGHT          : Decimal(5, 2);
        DIM_UNIT        : String(2);

        SUPPLIERS : Association to BusinessPartners;
    }

    entity Employee : cuid {
        nameFirst     : c.String64;
        nameLast      : c.String64;
        nameInitials  : c.String64;
        nameMiddle    : c.String64;
        gender        : c.Gender;
        language      : String(2);
        loginName     : String(16);
        phoneNumber   : c.PhoneNumber;
        email         : c.Email;
        Currency      : Currency;
        salaryAmount  : c.AmountT;
        accountNumber : c.String32;
        bankId        : String(16);
        bankName      : c.String64;
    }
}

context transaction {

    entity PurchaseOrders : c.Amount {
        key NODE_KEY : c.Guid;

        PO_ID : c.Guid;

        PARTNER : Association to master.BusinessPartners;

        LIFECYCLE_STATUS : String(1);
        OVERALL_STATUS   : String(1);

        Items : Association to many PurchaseItems
            on Items.PARENT = $self;
    }

    entity PurchaseItems : c.Amount {
        key NODE_KEY : c.Guid;

        PARENT : Association to PurchaseOrders;

        PO_ITEM_POS : Integer;

        PRODUCT : Association to master.Products;
    }
}