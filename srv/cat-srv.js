const cds = require("@sap/cds");
const { UPDATE, SELECT } = require("@sap/cds/lib/ql/cds-ql");
const { uuid, exists, isdir, read , mkdirp } = cds.utils;
 
// fun ---

module.exports = cds.service.impl(async function () {

    const {
        EmployeeSrv,
        BusinessPartnerSrv,
        AddressSrv,
        ProductionSrv,
        PurchaseItemSrv,
        PurchaseOrderSrv
    } = this.entities;


    this.before(['CREATE', 'UPDATE'], PurchaseItemSrv, async (req) => {

        const {
            GROSS_AMOUNT,
            CURRENCY_code,
            PO_ITEM_POS
        } = req.data;

        if (
            (CURRENCY_code === 'USD' && GROSS_AMOUNT > 50000) ||
            (CURRENCY_code === 'EUR' && GROSS_AMOUNT > 10000)
        ) {
            req.reject(
                400,
                'Gross amount exceeds the allowed limit. Please contact your line manager and region head.'
            );
        }

        if (
            PO_ITEM_POS !== undefined &&
            PO_ITEM_POS !== null &&
            PO_ITEM_POS % 10 !== 0
        ) {
            req.reject(
                400,
                'Purchase item position must be a multiple of 10.'
            );
        }
    });


    this.before('UPDATE', AddressSrv, async (req) => {

        const { COUNTRY } = req.data;

        if (
            COUNTRY &&
            !['GB', 'US'].includes(COUNTRY.toUpperCase())
        ) {
            req.reject(
                400,
                'Country must be GB or US. Please contact your administrator.'
            );
        }
    });


    this.before('UPDATE', EmployeeSrv, async (req) => {

        const { phoneNumber } = req.data;

        if (
            phoneNumber &&
            !phoneNumber.startsWith('+1') &&
            !phoneNumber.startsWith('+44')
        ) {
            req.reject(
                400,
                'Mobile number must contain US (+1) or GB (+44) country code.'
            );
        }
    });


    this.before('UPDATE', BusinessPartnerSrv, async (req) => {

        const { COMPANY_NAME } = req.data;

        if (
            COMPANY_NAME &&
            !/^[a-zA-Z0-9 ]+$/.test(COMPANY_NAME)
        ) {
            req.reject(
                400,
                'Company name must not contain special characters.'
            );
        }
    });


    this.on('createEmployee', async (req) => {

        const empData = req.data;

        try {

            await INSERT
                .into(EmployeeSrv)
                .entries(empData);

            return empData;

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('createBusinessPartner', async (req) => {

        const businessPartnerData = req.data;

        try {

            await INSERT
                .into(BusinessPartnerSrv)
                .entries(businessPartnerData);

            return businessPartnerData;

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('createAddress', async (req) => {

        const addressData = req.data;

        try {

            await INSERT
                .into(AddressSrv)
                .entries(addressData);

            return addressData;

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('updateEmployee', async (req) => {

        const {
            ID,
            salaryAmount,
            Currency_code
        } = req.data;

        try {

            await UPDATE(EmployeeSrv)
                .set({
                    salaryAmount: salaryAmount,
                    Currency_code: Currency_code
                })
                .where({
                    ID: ID
                });

            return "Successfully updated";

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('deleteEmployee', async (req) => {

        const { ID } = req.data;

        try {

            await DELETE
                .from(EmployeeSrv)
                .where({
                    ID: ID
                });

            return "Successfully deleted";

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('createProduct', async (req) => {

        const productData = req.data;

        try {

            await INSERT
                .into(ProductionSrv)
                .entries(productData);

            return productData;

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('deleteProduct', async (req) => {

        const { NODE_KEY } = req.data;

        try {

            await DELETE
                .from(ProductionSrv)
                .where({
                    NODE_KEY: NODE_KEY
                });

            return "Successfully deleted";

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('getHeighestPricedProduct', async (req) => {

        try {

            const product = await SELECT.one
                .from(ProductionSrv)
                .orderBy('PRICE desc');

            return product;

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('increasePrice', ProductionSrv, async (req) => {

        const NODE_KEY = req.params[0].NODE_KEY;

        try {

            const product = await SELECT.one
                .from(ProductionSrv)
                .where({
                    NODE_KEY: NODE_KEY
                });

            if (!product) {
                return req.reject(
                    404,
                    "Product not found"
                );
            }

            const newPrice = Number(product.PRICE) * 1.10;

            await UPDATE(ProductionSrv)
                .set({
                    PRICE: newPrice
                })
                .where({
                    NODE_KEY: NODE_KEY
                });

            return await SELECT.one
                .from(ProductionSrv)
                .where({
                    NODE_KEY: NODE_KEY
                });

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('top20Products', ProductionSrv, async (req) => {

        try {

            const products = await SELECT
                .from(ProductionSrv)
                .orderBy('PRICE desc')
                .limit(20);

            return products;

        } catch (err) {

            req.error(500, err.message);
        }
    });


    this.on('increaseSalary', EmployeeSrv, async (req) => {
        const { ID } = req.params[0];

        try {
            const employee = await SELECT.one
                .from(EmployeeSrv)
                .where({ ID: ID });

            if (!employee) {
                return req.reject(404, 'Employee not found');
            }

            const newSalary =
                employee.salaryAmount + (employee.salaryAmount * 0.15);

            await UPDATE(EmployeeSrv)
                .set({ salaryAmount: newSalary })
                .where({ ID: ID });

            return await SELECT.one
                .from(EmployeeSrv)
                .where({ ID: ID });

        } catch (error) {
            return req.reject(500, 'Cannot increase salary');
        }
    });


    this.on('top20Employee', EmployeeSrv, async (req) => {
        try {
            const employees = await SELECT
                .from(EmployeeSrv)
                .orderBy('salaryAmount desc')
                .limit(20);

            return employees;

        } catch (error) {
            return req.reject(500, 'Cannot find top 20 employees');
        }
    });
    this.on('largestOrder', PurchaseOrderSrv, async (req) => {

        try {

            const reply = await SELECT
                .from(PurchaseOrderSrv)
                .orderBy('GROSS_AMOUNT desc')
                .limit(5);

            return reply;

        } catch (err) {

            req.error(500, err.message);
        }
    });

    const {
        uuid,
        exists,
        isdir,
        read,
        decodeURI,
        fs,
        path
    } = cds.utils;

    this.on('getUtilities', async (request) => {

        let vUUID = uuid();
        let vPackageContent = null;
        let vInput = "%QW%RE";
        let uri;
        let dirExists = false;
        let isFileExists = false;
        let libDirExists = false;

        if (exists('srv/request.http')) {
            isFileExists = true;
        }

        if (isdir('app')) {
            dirExists = true;
        }

        uri = decodeURI(vInput);

        const folderPath = path.join(cds.root, 'srv', 'lib');

        fs.mkdirSync(folderPath, {
            recursive: true
        });

        if (isdir('srv/lib')) {
            libDirExists = true;
        }

        vPackageContent = await read('package.json');

        const finalValue = {
            uuid: vUUID,
            uri: uri,
            isFileExists: isFileExists,
            dirExists: dirExists,
            libDirExists: libDirExists,
            packageInfo: vPackageContent
        };

        return finalValue;
    });

});
