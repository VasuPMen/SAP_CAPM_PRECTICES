using {poapplication.db as database} from '../db/prectice_schema';
using {app.common as c} from '../db/comman';


service CatalogService {

    // @Capabilities: {
    //     InsertRestrictions.Insertable: true,
    //     UpdateRestrictions.Updatable : true,
    //     DeleteRestrictions.Deletable : true,
    //     ReadRestrictions.Readable    : false
    // }

    entity EmployeeSrv as projection on database.master.Employee
    actions {
        // read / featch
        action increaseSalary() returns EmployeeSrv;

        // perform opertation
    
        function top20Employee() returns array of EmployeeSrv;
    };

    entity ProductionSrv as projection on database.master.Products
    actions {
        action increasePrice() returns ProductionSrv;

        function top20Products() returns array of ProductionSrv;
    };

    entity BusinessPartnerSrv as projection on database.master.BusinessPartners;

    entity AddressSrv as projection on database.master.Addresses;

    entity PurchaseOrderSrv as
        projection on database.transaction.PurchaseOrders {
            *
        }
        actions {
            action discountPrice() returns array of PurchaseOrderSrv;

            function largestOrder() returns array of PurchaseOrderSrv;
        };

    entity PurchaseItemSrv as projection on database.transaction.PurchaseItems;


    function getHeighestPricedProduct() returns ProductionSrv;


    action createEmployee(
        Currency_code: String(3),
        ID: UUID,
        accountNumber: c.String32,
        bankId: String(16),
        bankName: c.String64,
        email: c.Email,
        gender: c.Gender,
        language: String(2),
        loginName: String(16),
        nameFirst: c.String64,
        nameInitials: c.String64,
        nameLast: c.String64,
        nameMiddle: c.String64,
        phoneNumber: c.PhoneNumber,
        salaryAmount: c.AmountT
    ) returns array of EmployeeSrv;


    action createBusinessPartner(
        NODE_KEY: c.Guid,
        BP_ROLE: c.Role,
        EMAIL: c.Email,
        MOBILE: c.PhoneNumber,
        FAX: c.String32,
        WEB: c.String255,
        BP_ID: c.Guid,
        COMPANY_NAME: c.String255
    ) returns array of BusinessPartnerSrv;


    action createAddress(
        NODE_KEY: c.Guid,
        ADDRESS_TYPE: c.String32,
        VAL_START: Date,
        VAL_END: Date,
        LATITUDE: Decimal,
        LONGITUDE: Decimal,
        STREET: c.String255,
        POSTAL_CODE: String(12),
        CITY: c.String255,
        COUNTRY: c.String255,
        BUILDING: c.String255
    ) returns array of AddressSrv;


    action createProduct(
        NODE_KEY: c.Guid,
        PRODUCT_ID: c.String32,
        TYPE_CODE: String(2),
        CATEGORY: c.String32,
        DESCRIPTION: c.String255,
        TAX_TARIF_CODE: Integer,
        MEASURE_UNIT: String(2),
        WEIGHT_MEASURE: Decimal(5, 2),
        WEIGHT_UNIT: String(2),
        PRICE: Decimal(15, 2),
        CURRENCY_CODE: String(5),
        WIDTH: Decimal(5, 2),
        DEPTH: Decimal(5, 2),
        HEIGHT: Decimal(5, 2),
        DIM_UNIT: String(2)
    ) returns ProductionSrv;


    action updateEmployee(
        ID: UUID,
        salaryAmount: c.AmountT,
        Currency_code: String(3)
    ) returns String;


    action deleteEmployee(
        ID: UUID
    ) returns String;


    action deleteProduct(
        NODE_KEY: UUID
    ) returns String;

    function getUtilities() returns String;
}
