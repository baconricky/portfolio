var itemStack = new Array();
function addItem(itemCode) {
    if (window["cartAPICheck"]) {
        // allow IE6 to cause a JS exception
        // 'cause checking the "cartAPICheck"
        // makes IE6 hang
        addItemToCart(itemCode, 1);
    } else {
        itemStack[itemStack.length] = itemCode;
    }
}


