const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const subscriptionsResource = testedResource + '/subscriptions/';

// Patches the object and returns a new copy of the patched object
// TECHNICAL DEBT: It should be imported from common.js
function patchObj(target, patch) {
    const copy = JSON.parse(JSON.stringify(target));
    return Object.assign(copy, patch);
}

describe('Create Subscription. Errors. JSON', () => {
    // Base subscription (mutable to make errors happen)
    const subscription = {
        id: 'urn:ngsi-ld:Subscription:9000',
        type: 'Subscription',
        entities: [
            {
                id: 'urn:ngsi-ld:T:T1234',
                type: 'T'
            }
        ],
        watchedAttributes: ['a1'],
        notification: {
            endpoint: {
                uri: 'http://localhost:1080'
            }
        }
    };

    it('should reject a subscription which id is not a URI 131', async function() {
        const testSubscription = patchObj(subscription, { id: '1234' });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which type is not Subscription 132', async function() {
        const testSubscription = patchObj(subscription, { type: 'T' });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which does not include "entities" nor "watachedAttributes" 133', async function() {
        const testSubscription = {
            id: 'urn:ngsi-ld:Subscription:9000',
            type: 'Subscription',
            notification: {
                endpoint: {
                    uri: 'http://localhost:1080'
                }
            }
        };

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });
	// No it should not. setting watchedAttibutes to null is syntactically the same as not giving it. No error should be expected here
    /*it('should reject a subscription which watched attributes is null 134', async function() {
        const testSubscription = patchObj(subscription, {
            watchedAttributes: null
        });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });*/

    it('should reject a subscription which watched attributes array is 0 length 135', async function() {
        const testSubscription = patchObj(subscription, { watchedAttributes: [] });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which entities array is 0 length 136', async function() {
        const testSubscription = patchObj(subscription, { entities: [] });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which entities array does not contain a type 137', async function() {
        const testSubscription = {
            id: 'urn:ngsi-ld:Subscription:9000',
            type: 'Subscription',
            entities: [
                {
                    id: 'urn:ngsi-ld:T:T1234'
                }
            ]
        };

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which does not define notification parameters 138', async function() {
        const testSubscription = {
            id: 'urn:ngsi-ld:Subscription:9000',
            type: 'Subscription',
            entities: [
                {
                    id: 'urn:ngsi-ld:T:T1234',
                    type: 'T'
                }
            ]
        };

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which "isActive" field is not a boolean 139', async function() {
        const testSubscription = patchObj(subscription, { isActive: 'abcde' });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which "endpoint" is not a URI 140', async function() {
        const notification = patchObj(subscription.notification, {
            endpoint: { uri: 'abcde' }
        });
        const testSubscription = patchObj(subscription, { notification });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    // TODO: Add here more tests (null values, etc.)
});
