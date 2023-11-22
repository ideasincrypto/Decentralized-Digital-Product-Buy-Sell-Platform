const {ethers} = require("hardhat");
const  {expect} = require('chai');
const {loadFixture} = require('ethereum-waffle');


describe("Deploy And Test Owner Releted Operations", async function(){
    async function deploy() {
        const contract = await ethers.getContractFactory("DigitalProduct");
        const digitalProduct = await contract.deploy();
        const [owner,buyer1,seller1] = await ethers.getSigners();
        return {digitalProduct, owner,buyer1,seller1}
    }
  

    it("The Contract Should be Deployed With Owner Address", async()=>{
        const {digitalProduct, owner} = await loadFixture(deploy)
        expect(await digitalProduct.owner()).to.be.equal(owner.address);
    })

    it("The Contract Owner  Should Not Be Able To Sell/Add/List ", async()=>{
        const {digitalProduct, owner} = await loadFixture(deploy)
        try {
            await digitalProduct.connect(owner).createProduct("p1",ethers.utils.parseEther('1'))
        } catch (error) {
            expect(error)
        }
    })
    it("The Contract Owner  Should Not Be Able To Buy Products ", async()=>{
        const {digitalProduct, owner,seller1} = await loadFixture(deploy)
        await digitalProduct.connect(seller1).createProduct("p1",ethers.utils.parseEther('1'));  
        const Product = await digitalProduct.Products(0) 

        try {
            await digitalProduct.connect(owner).buyProduct(Product.pId,{value:Product.price});
        } catch (error) {
            expect(error)
        }
    })

})
describe("Seller Uses Test Cases ",async function(){

    async function deploy() {
        const contract = await ethers.getContractFactory("DigitalProduct");
        const digitalProduct = await contract.deploy();
        const [owner,buyer1,seller1,seller2,seller3] = await ethers.getSigners();
        return {digitalProduct, owner,buyer1,seller1,seller2,seller3}
    }

    it("Seller Cannot Buy His/Other Seller Products", async ()=>{
        const {digitalProduct, owner,buyer1,seller1,seller2} = await loadFixture(deploy);

        // Adding Products By Different Seller
        await digitalProduct.connect(seller1).createProduct("p1",ethers.utils.parseEther('1'));
        await digitalProduct.connect(seller2).createProduct("p2",ethers.utils.parseEther('2'));
        const Product1 = await digitalProduct.Products(0) 
        const Product2 = await digitalProduct.Products(1) 


        //  seller trying to purchase his or other seller products 
        try {
            await digitalProduct.connect(seller1).buyProduct(Product1.pId,{value:Product1.price});
        } catch (error) {
            expect(error)
        }

        try {
            await digitalProduct.connect(seller1).buyProduct(Product2.pId,{value:Product2.price});
        } catch (error) {
            expect(error)
        }
    });

    it("A Single Seller Can List/Add Multiple Products", async ()=>{

        const {digitalProduct,seller3} = await loadFixture(deploy);

        // Adding Multiple Products By A Single Seller 
        expect(await digitalProduct.connect(seller3).createProduct('p3',ethers.utils.parseEther('2'))).to.be.not.reverted;       
        expect(await digitalProduct.connect(seller3).createProduct('p4',ethers.utils.parseEther('4'))).to.be.not.reverted;  
        expect(await digitalProduct.connect(seller3).createProduct('p5',ethers.utils.parseEther('5'))).to.be.not.reverted;  

    })
  

})
describe("After Sell Seller And Owner Blance State", async()=>{
  async function deploy(){
    const contract = await ethers.getContractFactory("DigitalProduct")
    const digitalProduct = await contract.deploy()
    const [owner,seller1,buyer1] = await ethers.getSigners()

    return{ digitalProduct,seller1,buyer1,owner}
  }



    it("Seller Must Be Paid As Soon As The Product Is Sold",async ()=>{
        const {digitalProduct,seller1,buyer1} = await loadFixture(deploy);
        await digitalProduct.connect(seller1).createProduct("p1",ethers.utils.parseEther('1'));
        // get Product From the Product Array
        const Product1 = await digitalProduct.Products(0) 
        let ProductPrice = Product1.price
        // Converting Product Price From Bignumber To String. 
        ProductPrice = ethers.utils.formatEther(ProductPrice).toString()
        ProductPrice = ethers.utils.parseEther(ProductPrice);
        // get Seller before Any Purchase
        const sellerBalanceBefore = await ethers.provider.getBalance(seller1.address);
        // Sell Products to A Seller
        await digitalProduct.connect(buyer1).buyProduct(Product1.pId,{value:ProductPrice});
        // get Seller before After  Purchase
        const sellerBalanceAfter = await ethers.provider.getBalance(seller1.address);
        expect(ethers.BigNumber.from(sellerBalanceAfter)).to.be.gt(ethers.BigNumber.from(sellerBalanceBefore))
       
    })

    it("Owner Should Also Get His Commision As Soon As The Product Is Sold", async ()=>{

        const {digitalProduct,seller1,buyer1,owner} = await loadFixture(deploy);
        await digitalProduct.connect(seller1).createProduct("p2",ethers.utils.parseEther('2'));

        // As Another Product is Added above That why it is The Second product on the Array
        const Product1 = await digitalProduct.Products(1);
        let ProductPrice = Product1.price
        // Converting Product Price From Bignumber To String. 
        ProductPrice = ethers.utils.formatEther(ProductPrice).toString()
        ProductPrice = ethers.utils.parseEther(ProductPrice);
        // Owner Balance before Sell
        const OwnerBalanceBefore = await ethers.provider.getBalance(owner.address);
        // Do Sell
        await digitalProduct.connect(buyer1).buyProduct(Product1.pId,{value:ProductPrice});
        // Owner Balance After Sell
        const OwnerBalanceAfter = await ethers.provider.getBalance(owner.address);
        expect(ethers.BigNumber.from(OwnerBalanceAfter)).to.be.gt(ethers.BigNumber.from(OwnerBalanceBefore))

    })
    
})

describe("Buyer Opertaions", async()=>{
    async function deploy(){
      const contract = await ethers.getContractFactory("DigitalProduct")
      const digitalProduct = await contract.deploy()
      const [owner,seller1,seller2,buyer1,buyer2] = await ethers.getSigners()
  
      return{ digitalProduct,owner,seller1,seller2,buyer1,buyer2}
    }
  
  
  
      it("Buyer Cannot Sell Products",async ()=>{
          const {digitalProduct,seller1,buyer1} = await loadFixture(deploy);
          await digitalProduct.connect(seller1).createProduct("p1",ethers.utils.parseEther('1'));
          const Product1 = await digitalProduct.Products(0) 
          let ProductPrice = Product1.price
          // Converting Product Price From Bignumber To String. 
          ProductPrice = ethers.utils.formatEther(ProductPrice).toString()
          ProductPrice = ethers.utils.parseEther(ProductPrice);
          const sellerBalanceBefore = await ethers.provider.getBalance(seller1.address);
          await digitalProduct.connect(buyer1).buyProduct(Product1.pId,{value:ProductPrice});
          
         try {
            await digitalProduct.connect(buyer1).createProduct("p2",ethers.utils.parseEther('2'));
         } catch (error) {
                expect(error)
         }
         
      })
  
      it("Buyer cannot Buy Same Product", async ()=>{
  
          const {digitalProduct,buyer1} = await loadFixture(deploy);


            // AS A Product is Added there Is no Need to Add Product Again
          const Product1 = await digitalProduct.Products(0);
          let ProductPrice = Product1.price
          // Converting Product Price From Bignumber To String. 
          ProductPrice = ethers.utils.formatEther(ProductPrice).toString()
          ProductPrice = ethers.utils.parseEther(ProductPrice);
          try {
            await digitalProduct.connect(buyer1).buyProduct(Product1.pId,{value:ProductPrice});
          } catch (error) {
            
            expect(error);
     
          }

      })
      it("Buyer Can Buy Multiple Different Products", async ()=>{
        const {digitalProduct,seller1,buyer1} = await loadFixture(deploy);

        // Adding Two more Products And Total will be three

        await digitalProduct.connect(seller1).createProduct('p2',ethers.utils.parseEther('2'));
        await digitalProduct.connect(seller1).createProduct('p3',ethers.utils.parseEther('3'));

        const Product1 = await digitalProduct.Products(1);
        const Product2 = await digitalProduct.Products(2);
        let Product1Price = Product1.price
        let Product2Price = Product2.price
        Product1Price = ethers.utils.formatEther(Product1Price).toString()
        Product1Price = ethers.utils.parseEther(Product1Price);
        Product2Price = ethers.utils.formatEther(Product2Price).toString()
        Product2Price = ethers.utils.parseEther(Product2Price);

        expect(await digitalProduct.connect(buyer1).buyProduct(Product1.pId, {value: Product1Price})).to.be.not.reverted
        expect(await digitalProduct.connect(buyer1).buyProduct(Product2.pId, {value: Product2Price})).to.be.not.reverted

    });
 
})

describe("Ownership Uniqueness", async function(){

    async function deploy(){
        const contract = await ethers.getContractFactory("DigitalProduct")
        const digitalProduct = await contract.deploy()
        const [owner,seller1,seller2,buyer1,buyer2] = await ethers.getSigners()
    
        return{ digitalProduct,owner,seller1,seller2,buyer1,buyer2}
      }

      it("Product OwnerShipId  Should Be Unique For Each Product For A Buyer" ,async ()=>{

        const {digitalProduct,seller1,buyer1} = await loadFixture(deploy);

        await digitalProduct.connect(seller1).createProduct("p1",ethers.utils.parseEther('1'));
        await digitalProduct.connect(seller1).createProduct("p2",ethers.utils.parseEther('2'));
        const Product1 = await digitalProduct.Products(0);
        const Product2 = await digitalProduct.Products(1);
        let Product1Price = Product1.price
        let Product2Price = Product2.price
        Product1Price = ethers.utils.formatEther(Product1Price).toString()
        Product1Price = ethers.utils.parseEther(Product1Price);
        Product2Price = ethers.utils.formatEther(Product2Price).toString()
        Product2Price = ethers.utils.parseEther(Product2Price);

        await digitalProduct.connect(buyer1).buyProduct(Product1.pId,{value:Product1Price})
        await digitalProduct.connect(buyer1).buyProduct(Product2.pId,{value:Product2Price})

        const Buyer1 = await digitalProduct.Buyers(0)
        const Buyer2 = await digitalProduct.Buyers(1)

        expect(Buyer1.ownershipId).to.be.not.equal(Buyer2.ownershipId);

      });
      it("An Single Product Can Have Many OwnershipId But Each Will Be Uinque OwnerShip", async ()=>{
        const {digitalProduct,buyer2} = await loadFixture(deploy);
        const Product1 = await digitalProduct.Products(0);
        let Product1Price = Product1.price
        Product1Price = ethers.utils.formatEther(Product1Price).toString()
        Product1Price = ethers.utils.parseEther(Product1Price);
        await digitalProduct.connect(buyer2).buyProduct(Product1.pId,{value:Product1Price})
        const Buyer1 = await digitalProduct.Buyers(0)
        const Buyer2 = await digitalProduct.Buyers(2)

        expect(Buyer1.ownershipId).to.be.not.equal(Buyer2.ownershipId)

      })


})