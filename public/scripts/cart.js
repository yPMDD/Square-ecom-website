


var stripe = Stripe(
    "pk_test_51QPXfpDKgovMDMcPJATlIsH7wa89h1KgRqLHTTd768Jr1y1vTfkZzcnhZevrTRvlHvDI30x9LCdgiaaRP3f3oN9N00FwHib3FE"
)
document.getElementById('checkout').addEventListener('click',function(){
    stripe.redirectToCheckout({
        lineItems:[
            {
                price:'price_1QQD4JDKgovMDMcPLYbKNVGl',
                quantity:1,
            },
        ],
        mode:'payment',
        successUrl:'https://google.com',
        cancelUrl: 'https:/x.com',
    }).then(function (result){
        
    });
    

    
    
});


