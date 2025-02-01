import { EshopBeClass } from "./eshopBeClass";
import { CartItem } from "../types/types";
import { CustomerData } from "../types/types";


const eshop = new EshopBeClass();

const testOrder = async () => {

    const testCustomer: CustomerData = {
        firstName: 'Jirka',
        lastName: 'Slanina',
        email:'hkst21@proton.me',
        phoneNumber: '730983298',
        deliveryAddress: 'Prdelová 39 Prague 1'
    }

    const testCart: CartItem[] = [{
        quantity: 1,
        product: {
            id: 1,
            name: 'Xiaomi Redmi Note 12',
            price: 1990,
            discount: 0,
            final_price: 1000 
        }   

        }];

        try {
            await eshop.validateAndCreateOrder(testCart, testCustomer);
            console.log('Objednávka byla úspěšně vytvořena a e-mail odeslán.');
        } catch (error) {
            console.error('Chyba při vytváření objednávky nebo odesílání e-mailu:', error);
        }

}
async function runTest() {
    try {
        await testOrder();
        console.log('Test úspěšně dokončen')
    }
    catch(e) {
        console.error('Test sehlal', e)
    }
}

runTest();