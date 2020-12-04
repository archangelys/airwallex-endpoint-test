const config = require('../config/env_config');
const request = require('supertest')(config.host[config.env]);
const expect = require('chai').expect;

describe('Airwallex endpoint test : common test cases', () => {

    /** can load from file dynamically using nconf
     *  test case is provided by list of json input.
     * @type {({args: {account_number: string, aba: string, bank_country_code: string, swift_code: string, account_name: string, payment_method: string}, expected: {result: {success: string}, status: number}, describe: string}|{args: {account_number: string, aba: string, bank_country_code: string, account_name: string, payment_method: string}, expected: {result: {error: string}, status: number}, describe: string})[]}
     */
    var testCases = [
        {
            describe: 'normal swift test case with success return',
            args: {
                "payment_method": "SWIFT",
                "bank_country_code": "US",
                "account_name": "John Smith",
                "account_number": "123",
                "swift_code": "ICBCUSBJ",
                "aba": "11122233A"
            },
            expected: {status: 200, result: {"success": "Bank details saved"}}
        },
        {
            describe: 'abnormal swift test case, no swift code',
            args: {
                "payment_method": "SWIFT",
                "bank_country_code": "US",
                "account_name": "John Smith",
                "account_number": "123",
                "aba": "11122233A"
            },
            expected: {status: 400, result: {"error": "'swift_code' is required when payment method is 'SWIFT'"}}
        }
    ]

    testCases.forEach((testCase) => {
        it('Running test: ' + testCase.describe, function (done) {
            this.timeout(10000);
            request.post('/bank')
                .send(testCase.args)
                .expect(testCase.expected.status)
                .expect((res) => {
                    // can use lots of chai assertion here
                    expect(res.body).to.be.contains(testCase.expected.result)
                })
                .end(done)
        });
    })
});

/**
 * these cases are not common case, including wrong methods or other exceptions
 */
describe('Airwallex endpoint test : special test cases', () => {
    it('Running test: Unsupported method ', function (done) {
        this.timeout(10000);
        request.get('/bank')
            .expect(404)
            .end(done)
    });
});